var mysql = require('mysql');

function createDBConnection() {
    //console.log('ENV: ' + process.env.NODE_ENV);

    if (!process.env.NODE_ENV || process.env.node === 'dev') {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'padtec',
            database: 'casadocodigo_nodejs'
        });
    }

    if (process.env.NODE_ENV === 'test') {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'padtec',
            database: 'casadocodigo_nodejs_test'
        });
    }

    if (process.env.NODE_ENV === 'production') {
        var url = process.env.CLEARDB_DATABASE_URL;
        // Expressão regular para pegar as informações da variavel CLEARDB_DATABASE_URL
        // Da para preencher na mão tb
        var grupos = url.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?/);
        return mysql.createConnection({
            host: grupos[3],
            user: grupos[1],
            password: grupos[2],
            database: grupos[4]
        });
    }
}

// Wrapper - embrulha a outra função
module.exports = function () {
    return createDBConnection;
};
