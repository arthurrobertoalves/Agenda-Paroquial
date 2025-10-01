const express = require('express')
const mysql = require('mysql2')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const app = express()


const { engine } = require('express-handlebars')



app.engine('handlebars', engine());
app.set('view engine', 'handlebars')
app.set('views', './views');

app.use(session({
    secret: 'SEGREDO_DE_SESSAO_AQUI_SIMPLES',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

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
    let usuario = req.body.usuarios;
    let senha = req.body.senha; 
    let paroquia_id = req.body.paroquia_id;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        
        bcrypt.hash(senha, salt, (err, hash) => {
            if (err) throw err;
            
            const senhaCriptografada = hash;
            
            let sql = `INSERT INTO usuarios (usuarios, senha, paroquia_id) VALUES (?, ?, ?)`;
            
            conexao.query(sql, [usuario, senhaCriptografada, paroquia_id], function (erro, retorno) {
                if (erro) {
                    console.error('Erro ao cadastrar usuário:', erro);
                    return res.status(500).send('Erro ao cadastrar. Tente novamente.');
                }
                console.log('Usuário cadastrado com sucesso:', retorno);
                res.redirect('/login');
            });
        });
    });
});

app.listen(1818, () => {
    console.log('http://localhost:1818')
})