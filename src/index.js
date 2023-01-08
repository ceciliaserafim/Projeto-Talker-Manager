const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const talkerJason = path.resolve(__dirname, './talker.json');

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
  const talkerDirect = JSON.parse(await fs.readFile(path.resolve(talkerJason)));
 return res.status(200).json(talkerDirect);
});

// requisito 2
app.get('/talker/:id', async (req, res) => {
  try {
     const talkers = await fs.readFile();
     const talker = talkers.find(({ id }) => id === Number(req.params.id));
     return res.status(200).json(talker);
   } catch (err) {
     return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
   }
 });

  // requisito 3
  // app.use(express.json());
  // app.post('/login', (req, res) => {
  //   const newLogin = { ...req.body };
  //   login.push(newLogin);
  
  //   return res.status(201).json({ login: newLogin });
  // });

  // requisito 7
  // app.delete('/talker/:id', (req, res) => {
  //   const { id } = req.params;
  //   const arrayPosition = talker.findIndex((talkerElement) => talkerElement.id === Number(id));
  //   talker.splice(arrayPosition, 1);
  //   res.status(204).end();
    // authorization Caso o token não seja encontrado retorne um código de status 401, com o seguinte corpo:
// {
//   "message": "Token não encontrado"
// }
  // Caso o token seja inválido retorne um código de status 401, com o seguinte corpo:

// {
//   "message": "Token inválido"
// }
  // });

app.listen(PORT, () => {
  console.log('Online');
});
