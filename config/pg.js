const { Client } = require('pg');

module.exports = {
    pgClient: new Client({
        connectionString: "postgres://quizdb:quizdb@localhost:55000/quizdb"
    })
};
