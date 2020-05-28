module.exports = function (app) {
    var urlProdutos = '/produtos';

    app.get(urlProdutos, function (req, res, next) {
        const connection = app.infra.connectionFactory();
        // Chama o produtosBanco
        var produtosDAO = new app.infra.produtosDAO(connection);

        // Faz o select
        produtosDAO.lista(function (erros, results) {
            console.log('ERROR: ' + erros);
            console.log('SUCCESS: ' + results);
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
