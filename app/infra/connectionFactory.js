var mysql = require('mysql');

function createDBConnection() {
    console.log('ENV: ' + process.env.NODE_ENV);
    if (!process.env.NODE_ENV || process.env.node === 'dev') {
        return mysql.createConnection({
            host: '172.17.0.2',
            user: 'root',
            password: 'root',
            database: 'casadocodigo_nodejs'
        });
    }

    if (process.env.NODE_ENV === 'test') {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'casadocodigo_nodejs_test'
        });
    }

    if (process.env.NODE_ENV === 'production') {
        // Pega a URL do Heroku e monta a conexão
        // mysql://be0d6a7e3c02b2:e1f9f7c1@us-cdbr-iron-east-04.cleardb.net/heroku_bedd801500e58f6?reconnect=true
        var url = process.env.CLEARDB_DATABASE_URL;
        var grupos = url.match(/mysql:\/\/(.*):(.*)@(.*)\/(.*)\?/);
        console.log('GRUPOS: ' + grupos)
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
