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
app.use(express.urlencoded({ extended: true }))
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'agendaparoquial'
})

conexao.connect(function (erro, retorno) {
    if (erro) throw erro;
    console.log("Conexão concluida com sucesso!")
});

app.get('/', function (req, res) {
    res.send('HELLO WORLD')
})

app.get('/cadastro', function (req, res) {
    res.render('cadastro')

})

app.get('/login', function (req, res) {
    res.render('login')
})

app.get('/eventos', function(req, res) {
    // 1. Consulta SQL para buscar todos os eventos, ordenados pela data mais próxima
    let sql = "SELECT * FROM eventos ORDER BY data ASC"; 
    
    conexao.query(sql, function (erro, eventos) {
        if (erro) {
            console.error('Erro ao buscar eventos:', erro);
            // Renderiza a página com uma mensagem de erro se a busca falhar
            return res.render('eventos', { erro: 'Não foi possível carregar os eventos.' });
        }
        
        // 2. Renderiza a view 'eventos' e passa a lista de eventos
        res.render('eventos', { eventos: eventos });
    });
});

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
                    return ('Erro ao cadastrar. Tente novamente.');
                }
                console.log('Usuário cadastrado com sucesso:', retorno);
            });
        });
    });
    res.redirect('/eventos')
});

app.listen(1818, () => {
    console.log('http://localhost:1818')
})