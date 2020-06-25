# Treinamento Heroku - Node, MySQL

## Instalar
```
### MySQL
docker run -p 3306:3306 --name db-mysql5.5 -e MYSQL_ROOT_PASSWORD=root -d mysql:5.5
### Verificar IP do container
docker network inspect bridge
"Name": "db-mysql",
"IPv4Address": "****",

sudo npm install -g nodemon             <- Hotdeploy
npm install express --save              <- Gerencia as urls
npm install mysql --save                <- MySQL Database
npm install express-load --save         <- Carrega os modulos automatico por pastas
npm install body-parser --save          <- Para pegar as informações do form
npm install express-validator --save    <- Validador
npm install mocha --save-dev            <- Testes
npm install supertest --save-dev        <- Testes
npm install ejs --save                  <- Criar páginas dinâmicas - Embedded JavaScript templates

### Criar as tabelas
sql/create_database.sql

### Atualizar o Node.js
sudo apt-get install npm
sudo apt-get install nodejs
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
npm -v                                  <- Utilizei a 6.14.4
node -v                                 <- Utilizei a 12.17.0

### Start no projeto
nodemon app                             <- Roda o nodemon (DEV)
NODE_ENV=production npx nodemon         <- Roda em production caso utilize outro DB
NODE_ENV=test npx nodemon
ps -ef | grep node            <- Kill nodemon
kill -9 number



```

## Comentários
```
GET DB Heroku Easy
const groups = process.env.CLEARDB_DATABASE_URL.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?/);
const user = groups[1];
const pass = groups[2];
const url = groups[3];
const db = groups[4];

console.log(`USER -> ${user}`);
console.log(`PASS -> ${pass}`);
console.log(`DB   -> ${db}`);
console.log(`URL  -> ${url}`);

sequelize = new Sequelize(
            database,
            user,
            pass, {
                host: url,
                dialect: 'mysql',
                logging: true
            });
        
_connection <- Variavel privada
Executar um arquivo -> node produtos.js

### Retornando um HTML
if (req.url == "/produtos") {
  res.end("<html><body>listando os produtos da loja</body>");
} else {
  res.end("<html><body>home da casa do codigo</body></html>");
}

********************************************************************************
#Utilizando o EJS - Cria páginas dinâmicas
[file -> app.js]
/*
Para que o Express reconheça a Engine EJS,
você precisa adicioná-la como uma view engine da sua app
 */
app.set('view engine','ejs');
app.get('/produtos',function(req,res){
    // Ele chama essa página que fica dentro da pasta views
    res.render("produtos/lista")
});
[file -> lista.ejs]
<html>
<body>
<table>
    <tr>
        <td>id</td>
        <td>nome</td>
    </tr>
    <tr>
        <td>1</td>
        <td>livro de node js</td>
    </tr>
</table>
</body>
</html>

### Isolando as configurações do Express
[file -> config/express.js]
// Retorna sempre a mesma versão do objeto
var app = require('express')();
// Para utilizar paginas dinamicas
app.set('view engine', 'ejs');
// Exporta o app
module.exports = function () {
    return app;
};
[file -> app.js]
var app = require('./config/express')();

### CommonJS é uma convenção para carregamentos de módulos javascript em aplicações server-side.
O objeto que o node disponibiliza é o module e a função é passada para o atributo exports desse objeto.

### Isolando o código das rotas
[file -> casadocodigo/app/routes/produtos.js]
Criar o arquivo com as rotas
module.exports = function (app) {
  app.get('/produtos', function (req, res) {
    res.render("produtos/lista");
  });
};
[file -> casadocodigo/app.js]
var app = require('./config/express')();
#Passar o app para ele
require('./app/routes/produtos')(app);

### Consultando o banco de dados
[file -> casadocodigo/app/routes/produtos.js]
module.exports = function (app) {
  app.get('/produtos', function (req, res) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'padtec',
      database: 'casadocodigo_nodejs'
    });
    connection.query('select * from livros', function (err, results) {
      res.send(results);
    });
    connection.end();
  });
};

### Isolando a criação da conexão com o banco de dados
[file -> app/infra/connectionFactory.js]
var mysql = require('mysql');
module.exports = function () {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'teste',
        database: 'casadocodigo_nodejs'
    });
};
[file -> app/routes/produtos.js]
var connectionFactory = require('../infra/connectionFactory');
module.exports = function (app) {
    app.get('/produtos', function (req, res) {
        var connection = connectionFactory();
        connection.query('select * from livros', function (err, results) {
            res.render('produtos/lista', {lista: results});
        });
        connection.end();
    });
};

### Carregamento automático dos módulos
[file -> config/express.js]
var express = require('express');
var load = require('express-load');
var app = express();
module.exports = function () {
    app.set('view engine', 'ejs');
    app.set('views', './app/views');
    // Lista os que serão carregados automaticamente dentro do app
    // cwd: 'app -> Buscar a partir dessa pastas
    // Carrega tudo dentro da pasta app/routes e infra (module.exports)
    load('routes', {cwd: 'app'})
        .then('infra')
        .into(app);
    return app;
};

[file -> app/routes/produtos.js]
// Pega a connection que foi carregada
var connection = app.infra.connectionFactory();

### Isolando o acesso aos dados do banco
[file -> casadocodigo/app/infra/produtosDAO.js]
module.exports = function () {
  this.lista = function (connection, callback) {
    connection.query('select * from livros', callback);
  };
  return this;
};

### Chamando o select [file -> casadocodigo/app/routes/produtos.js]
var produtosBanco = app.infra.produtosBanco;
produtosBanco.lista(connection, function (err, results) {
  res.render('produtos/lista', {lista: results});
});
connection.end();

### Utilizando o DAO
[file -> casadocodigo/app/infra/produtosDAO.js]
function ProdutosDAO(connection) {
  this._connection = connection;
}
ProdutosDAO.prototype.lista = function (callback) {
  this._connection.query('select * from livros', callback);
};
module.exports = function () {
  return ProdutosDAO;
};
[file -> casadocodigo/app/routes/produtos.js]
const connection = app.infra.connectionFactory();
var produtosDAO = new app.infra.produtosDAO(connection);
produtosDAO.lista(function (err, results) {
  res.render('produtos/lista', {lista: results});
});
connection.end();

### Salvando os produtos no banco
[file -> config/express.js]
// Retorna sempre a mesma versão do objeto
var bodyParser = require('body-parser');
module.exports = function () {
  var app = express();
  app.set('view engine', 'ejs');
  app.set('views', './app/views');
  // O urlencoded é o justamente o formato que o formulário envia os dados por default
  app.use(bodyParser.urlencoded({extended: true}));
  ...
  return app;
};

### Redirect
res.redirect('/produtos');

### Content Negotiation (Se o retorno é json ou html)
[file -> old/cliente-android.js]
// Faz o get na URL e traz json ou html
var http = require('http');
var configuracoes = {
    hostname: 'localhost',
    port: 3000,
    path: '/produtos',
    headers: {
        'Accept': 'application/json'
        //'Accept': 'text/html'
    }
};
http.get(configuracoes, function (res) {
    console.log(res.statusCode);
    res.on('data', function (body) {
        console.log('Corpo: ' + body);
    });
});
[file -> app/routes/produtos.js]
#Verifica se é html ou json
res.format({
    html: function () {
        res.render('produtos/lista', {lista: results});
    },
    json: function () {
        res.json(results)
    }
});

### Suportando JSON no cadastro
[file -> config/express.js]
// Para aceitar Json
app.use(bodyParser.json());
[file -> old/cadastra-livros-terminal.js]
var http = require('http');
var configuracoes = {
    hostname: 'localhost',
    port: 3000,
    method: 'post',
    path: '/produtos',
    headers: {
        // Consome json
        'Accept': 'application/json',
        // Envia json
        'Content-type': 'application/json'
    }
};
// Prepara o post
var client = http.request(configuracoes, function (res) {
    // Imprime o status da request
    console.log(res.statusCode);
    res.on('data', function (body) {
        console.log('Corpo: ' + body);
    });
});
var produto = {
    titulo: 'mais sobre node',
    descricao: 'node, javascript e um pouco sobre http',
    preco: '100'
};
// Faz o post
client.end(JSON.stringify(produto));

### Exibindo as mensagens de erro para o usuário
npm install express-validator --save <- Ativando o validador
[file -> casadocodigo/config/express.js]
var expressValidator = require('express-validator');
module.exports = function () {
    ...
    app.use(expressValidator());
    ...
};
[file -> casadocodigo/app/routes/produtos.js]
req.assert('titulo', 'Campo obrigatório').notEmpty();
req.assert('preco', 'Formato inválido').isFloat();
const erros = req.validationErrors();
if (erros) {
  res.render('produtos/form', {errosValidacao: erros});
  return;
}

### Instalando o Mocha e executando testes
Por default ele busca a pasta test
node_modules/mocha/bin/mocha <- Executa os testes
var http = require('http');
var assert = require('assert');
// Qual controller vai testar
describe('#ProdutosController', function () {
    it('#listagem json', function (done) {
        var configuracoes = {
            hostname: 'localhost',
            port: 3000,
            path: '/produtos',
            headers: {
                'Accept': 'application/json'
            }
        };
        http.get(configuracoes, function (res) {
            assert.equal(res.statusCode, 200);
            assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
            // Quando termina chama ele para finalizar
            done();
        });
    });
});

### Lidando com o servidor nos testes
node_modules/mocha/bin/mocha
// Passa o nosso Servidor para o supertest, não precisa do servidor rodando
var express = require('../config/express')();
var request = require('supertest')(express);
describe('#ProdutosControllerNewSupertest', function () {
    // Nesse não precisa do assert
    it('#listagem json', function (done) {
        request.get('/produtos') // Get
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/) // Retorna Json
            .expect(200, done); // Verifica se o retorno é 200 e finaliza
    });
});

### Executando os testes em um banco exclusivo
NODE_ENV=test node_modules/mocha/bin/mocha <- Passa o parametro
#Recebe o parametro
if (process.env.NODE_ENV == 'test') {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'padtec',
    database: 'casadocodigo_nodejs_test'
  });
}

### Deleta os dados antes do teste
beforeEach(function (done) {
    var conn = express.infra.connectionFactory();
    new express.infra.produtosDAO(conn)
        .delete(function (erros) {
            if (!erros) done();
        });
    conn.end();
});

### Tratando os recursos estáticos com Express
// Mostra onde estão os arquivos estaticos
app.use(express.static('./app/public'));
[file -> app/routes/home.js] <- Aponta para o home que usa os arquivos staticos
module.exports = function (app) {
    app.get('/', function (req, res) {
        const connection = app.infra.connectionFactory();
        var produtosDAO = new app.infra.produtosDAO(connection);
        produtosDAO.lista(function (erros, resultados) {
            res.render('home/index', {livros: resultados});
        });
        connection.end();
    });
};

### WebSocket no cliente (Chama de tempos em tempos, callable)
npm install socket.io --save
#Front
[file -> casadocodigo/app/views/home/index.ejs]
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();
  socket.on('novaPromocao',function(data){
    debugger;
    console.log("Golllllll");
    alert("Livro em promocao " + data.livro.id)
  });
</script>
#Back
[file -> casadocodigo/app/routes/promocoes.js]
app.post("/promocoes", function (req, res) {
  var promocao = req.body;
  console.log(promocao);
  app.get('io').emit('novaPromocao',promocao);
  res.redirect('promocoes/form');
});
#Preparando
[file -> casadocodigo/app.js]
var port = 3000;
var app = require('./config/express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('io', io);
// Para funcionar o IO precisa iniciar assim o listen
http.listen(port, function () {
  console.log('Servidor rodando -> http://%s:%s', 'localhost', port);
});

### Entendendo os Middlewares
Praticamente tudo é middleware quando trabalhamos com o Express e isso é legal,
pois podemos inserir funções que serão executadas no meio do código.
Os Middlewares são funções cujo objetivo é possibilitar a interceptação do request e adicionar verificações e comportamentos sobre eles.
Vários plugins que utilizamos na aplicação junto do express fazem uso dos middlewares.
É o caso do bodyparser ou do express-validator, para citar dois exemplos.
#Testando Middlewares que intercepta os erros
NODE_ENV=production npx nodemon <-  Da para passar prop
[file -> casadocodigo/config/express.js]
// Caso dê pagina não encontrada (Colocar depois do load('routes', {cwd: 'app'}).then('infra').into(app))
app.use(function (req, res, next) {
  res.status(404).render('error/404');
});

### Preparando nosso ambiente para o deploy da aplicação no Heroku
#Ele pega as informações pelo gihub
#Executar esses comandos dentro da pasta q já está no git
https://dashboard.heroku.com/apps
https://devcenter.heroku.com/articles/heroku-cli#download-and-install
$ heroku                            <- lista as opções
$ heroku apps                       <- Lista os apps publicados
$ heroku login                      <- Precisa passar o email e senha
$ heroku apps --help                <- Mostra o q pode fazer com eles
$ heroku apps:create cdc-node-01    <- Cria o app
#Cria o banco de dados (É free mais precisa add o cartão de crédito)
$ heroku addons:create cleardb:ignite   <- Cria o banco mais básico
$ heroku config                         <- URL do banco
CLEARDB_DATABASE_URL:
mysql://be0d6a7e3c02b2:e1f9f744@us-awds-iron-east-04.cleardb.net/heroku_bedd444400e58f6?reconnect=true
be0d66666662b2                      <- Login
e1f9f744                            <- Senha
us-awds-iron-east-04.cleardb.net    <- URL de conexão (host)
heroku_bedd444400e58f6              <- Nome do banco
$ git push heroku master            <- Sobe a versão para p hiroku
```
## Gerar imagem Docker
```bash
$ docker build -t gustavocarvalhoti/heroku-node .
```

## Rodando a imagem
```bash
$ docker run -p 3000:3000 -d gustavocarvalhoti/heroku-node
```

## Subindo a imagem para o Docker Hub
```bash
$ docker login
$ docker push gustavocarvalhoti/peer-to-peer
```
