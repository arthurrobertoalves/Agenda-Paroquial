const express = require('express')
const mysql = require('mysql2')
const app = express()

const { engine } = require('express-handlebars')


app.engine('handlebars', engine());
app.set('view engine', 'handlebars')
app.set('views', './views');

app.use(express.static('./css'));
app.use(express.urlencoded());

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'usuarios'
})

conexao.connect(function (erro, retorno) {
    if (erro) throw erro;
    console.log("Conexão concluida com sucesso!")
});

app.get('/', function (req, res) {
    res.send('HELLO WORLD')
})

app.post('/cadastro', function (req, res) {
    let usuario = req.body.usuarios
    let senha = req.body.senha
    console.log(usuario, senha)
    let sql = `INSERT INTO usuarios (usuarios, senha) VALUES (?, ?)`;

    conexao.query(sql, [usuario, senha], function (erro, retorno) {
        if (erro) throw erro;
        console.log('Usuário cadastrado com sucesso:', retorno);
        res.end()
    });


})

app.listen(1818, () => {
    console.log('http://localhost:1818')
})