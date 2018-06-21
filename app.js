//var express = require('express');
//var app = express();

/*
Para que o Express reconheça a Engine EJS,
você precisa adicioná-la como uma view engine da sua app
 */
//app.set('view engine', 'ejs');
var port = 3000;
var app = require('./config/express')();
// Para fucionar a auto verificação
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('io', io);

//require('./app/routes/produtos')(app);
//require('./app/routes/home')(app);

/*
app.get('/', function (req, res) {
    console.log("/home1");
    res.send("<html><body><h1>Home</h1></body></html>");
});
*/

/*
app.get('/produtos', function (req, res) {
    console.log("/produtos");
    res.render("produtos/lista")
});
*/

/*
app.listen(port, function () {
  console.log('Servidor rodando -> http://%s:%s', 'localhost', port);
});
*/

// Para funcionar o IO precisa iniciar assim o listen
http.listen(port, function () {
  console.log('Servidor rodando -> http://%s:%s', 'localhost', port);
});


//Heroko
/*
var app = require('./config/express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('io',io);
var porta = process.env.PORT || 3000;
http.listen(porta,fuhnction(){
    console.log("Servidor rodando no heroku");
});
*/