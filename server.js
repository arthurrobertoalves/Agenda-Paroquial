const express = require('express')
const app = express()

app.use(express.urlencoded());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mypassword',
  database: 'testdb'
});

app.get('/', function (req, res) {
    res.send('HELLO WORLD')
})

app.post('/cadastro', function (req, res) {
    let nome = req.body.nome
    let senha = req.body.senha
    console.log(nome, senha)
    res.end()
})

app.listen(1818, () => {
    console.log('http://localhost:1818')
})