const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

// Middleware CORS
app.use(cors());

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '273107',
    database: 'openweather_db',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados!');
  }
});

app.get('/api/dados_climaticos', (req, res) => {
  const query = 'SELECT * FROM weather';
  console.log('teste')
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao executar a consulta MySQL:', error);
      res.status(500).send('Erro ao recuperar dados do banco de dados.');
    } else {
        console.log(results)
        res.send(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor Express rodando na porta ${port}`);
});
