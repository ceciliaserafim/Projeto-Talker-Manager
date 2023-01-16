const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const validateEmail = require('./middlewares/validateEmail');
const validatePassword = require('./middlewares/validatePassword');
const authorization = require('./middlewares/authorization');
const name = require('./middlewares/name');
const age = require('./middlewares/age');
const validateTalk = require('./middlewares/validateTalk');
const watchedAt = require('./middlewares/watchedAt');
const rate = require('./middlewares/rate');

const talkerJson = ('src/talker.json');
// const talkersRoute = JSON.parse(await fs.readFile(path.resolve('src/talker.json')));

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
// requisito 1.
app.get('/talker', async (_req, res) => {  
  // console.log(talkerJson);
  const talkerDirect = JSON.parse(await fs.readFile(path.resolve(talkerJson)));
 return res.status(200).json(talkerDirect);
});

// requisito 2

app.get('/talker/:id', async (req, res) => {  
     const talkers = JSON.parse(await fs.readFile(talkerJson));
     const talker = talkers.find(({ id }) => id === Number(req.params.id));
     if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
     return res.status(200).json(talker);
   });

  // requisitos 3 e 4

  app.post('/login', validatePassword, validateEmail, (_req, res) => {   
    const token = crypto.randomBytes(8).toString('hex');
    return res.status(200).json({ token });  
});
// requisito 5
app.post('/talker', validateTalk, watchedAt, authorization, name, age, rate, async (req, res) => {
  const talker = req.body;  
  const talkers = JSON.parse(await fs.readFile(talkerJson));
  // id no talker
  const newTalker = {
    //       // acessamos a chave id do ultimo objeto do array de maneira dinâmica e incrementamos + 1 em seu valor
          id: talkers.length + 1,
          ...talker,
        };
  talkers.push(newTalker);  
  // writeFile não tem retorno assim como o .push
  await fs.writeFile((talkerJson), JSON.stringify(talkers));
  return res.status(201).json(newTalker);
});

// requisito 6.

app.put('/talker/:id', 
validateTalk, 
watchedAt, 
rate, 
authorization, 
name, 
age, 
async (req, res) => { 
  const { id } = req.params;
  const talker = req.body;
  const talkers = JSON.parse(await fs.readFile(talkerJson));
  const index = talkers.find((element) => element.id === Number(id));
  const newTalker = {
           id: index.id,
          ...talker,
        };
  const indice = talkers.indexOf(index);
  talkers.splice(indice, 1, newTalker);
  await fs.writeFile('src/talker.json', JSON.stringify(talkers));
  return res.status(200).json(newTalker);
});

 // requisito 7
 
  app.delete('/talker/:id', authorization, async (req, res) => {
    const { id } = req.params;
    const talker = JSON.parse(await fs.readFile('src/talker.json')); 
    const filterTalker = talker.filter((talkerElement) => talkerElement.id !== Number(id));
    console.log(filterTalker);
    await fs.writeFile('src/talker.json', JSON.stringify(filterTalker));
    return res.status(204).send();
  });

app.listen(PORT, () => {
  console.log('Online');
});
