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
    //titulo: '',
    descricao: 'node, javascript e um pouco sobre http',
    preco: 100
};

// Faz o post
client.end(JSON.stringify(produto));