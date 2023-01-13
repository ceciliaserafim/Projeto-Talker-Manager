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

const talkerJson = path.resolve(__dirname, './talker.json');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});
// requisito 1
app.get('/talker', async (_req, res) => {  
  const talkerDirect = JSON.parse(await fs.readFile(path.resolve(talkerJson)));
 return res.status(200).json(talkerDirect);
});

// requisito 2

app.get('/talker/:id', async (req, res) => {  
     const talkers = JSON.parse(await fs.readFile(path.resolve(talkerJson)));
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
  const talkers = JSON.parse(await fs.readFile('./src/talker.json', 'utf-8'));
  // console.log(JSON.parse(talkers))
  talkers.push(talker);
  const whriteTalker = await fs.writeFile(talkerJson, JSON.stringify(talkers));
  return res.status(201).json({ whriteTalker });
});

// requisito 6
// app.put('/talker/:id', validateTalk, watchedAt, rate, auth, name, age, async,(req, res) => {  
// });

  // requisito 7
  app.delete('/talker/:id', authorization, async (req, res) => {
    const { id } = req.params;
    const talker = await fs.readFile(talkerJson);
    const filterTalker = talker.filter((talkerElement) => talkerElement.id === Number(id));
    const updatedTalker = JSON.stringify(filterTalker, null, 2);
    await fs.writeFile(talkerJson, updatedTalker);
    res.status(204).send();
  });

app.listen(PORT, () => {
  console.log('Online');
});
