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

app.get('/talker', async (_req, res) => {  
  const talkerDirect = JSON.parse(await fs.readFile(path.resolve(talkerJason)));
 return res.status(200).json(talkerDirect);
});

app.listen(PORT, () => {
  console.log('Online');
});
