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