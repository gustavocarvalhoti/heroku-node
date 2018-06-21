// Exporta o modulo
/*
module.exports = app.get('/produtos', function (req, res) {
  res.render("produtos/lista");
});
*/
//var connectionFactory = require('../infra/connectionFactory');

module.exports = function (app) {
  var urlProdutos = '/produtos';

  app.get(urlProdutos, function (req, res, next) {
    /*
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'teste',
        database: 'casadocodigo_nodejs'
    });

    const connection = app.infra.connectionFactory();
    connection.query('select * from livros', function (err, results) {
        res.render('produtos/lista', {lista: results});
    });
    */

    const connection = app.infra.connectionFactory();
    // Chama o produtosBanco
    var produtosDAO = new app.infra.produtosDAO(connection);

    // Faz o select
    produtosDAO.lista(function (erros, results) {
      //console.log(erros);
      if (erros) return next(erros);

      res.format({
        html: function () {
          res.render('produtos/lista', {lista: results});
        },
        json: function () {
          res.json(results)
        }
      });
    });
    connection.end();
  });

  app.get(urlProdutos + '/form', function (req, res) {
    // Chama e passa a variavel vazia
    res.render('produtos/form', {errosValidacao: {}});
  });

  app.post(urlProdutos, function (req, res) {
    const produto = req.body;
    req.assert('titulo', 'Campo obrigatório').notEmpty();
    req.assert('preco', 'Formato inválido').isFloat();

    const erros = req.validationErrors();
    if (erros) {
      res.status(400);
      res.format({
        html: function () {
          res.render("produtos/form",
              {validationErrors: errors, produto: produto});
        },
        json: function () {
          res.send(erros);
        }
      });
      return;
    }

    const connection = app.infra.connectionFactory();
    const produtosDAO = new app.infra.produtosDAO(connection);
    produtosDAO.save(produto, function (erros, resultados) {
      // Redirect
      res.redirect(urlProdutos);
    });
  });
};