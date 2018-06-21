// Passa o nosso Servidor para o supertest
var express = require('../config/express')();
var request = require('supertest')(express);

describe('#ProdutosControllerNewSupertest', function () {

    // Antes de começar o teste roda esse
    beforeEach(function (done) {
        var conn = express.infra.connectionFactory();
        new express.infra.produtosDAO(conn)
            .delete(function (erros) {
                if (!erros) done();
            });
        conn.end();
    });

    // Nesse não precisa do assert
    it('#listagem json', function (done) {
        request.get('/produtos') // Get
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/) // Retorna Json
            .expect(200, done); // Verifica se o retorno é 200 e finaliza
    });

    it('#Cadastro de novo produto com dados invalidos', function (done) {
        request.post('/produtos')
            .set('Accept', 'application/json')
            .send({titulo: "", descricao: "Novo livro"})
            .expect(400, done);
    });

    it('#Cadastro de novo produto com dados validos', function (done) {
        request.post('/produtos')
            .set('Accept', 'application/json')
            .send({titulo: "Java", descricao: "Novo livro de Java", preco: 20.50})
            .expect(302, done);
    });

});