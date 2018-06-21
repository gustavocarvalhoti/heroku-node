// Iniciando um servidor na porta 3000 que retorna um HTML simples
/*
var http = require('http');
var server = http.createServer(function (req, res) {
  res.end("<html><body><h1>Servidor running!</h1></body></html>");
});
server.listen(3000);
console.log("Servidor ta rodando");
*/

var http = require('http');
var porta = 3000;
var ip = "localhost";
http.createServer(function (req, res) {
  // Retorna o status da request
  // 200 - Sucesso
  // 400 - Bad Request
  // 500 - Internal Server Error
  res.writeHead(200, {'Content-Type': 'text/html'});

  // Verificando a url
  if (req.url == "/produtos") {
    res.end("<html><body>listando os produtos da loja</body>");
  } else {
    res.end("<html><body>home da casa do codigo</body></html>");
  }
}).listen(porta, ip);

console.log("Server running at http://" + ip + ":" + porta + "/");