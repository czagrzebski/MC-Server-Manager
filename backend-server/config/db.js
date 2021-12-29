const knex = require('knex');

//Create a Knex instance to access User DB
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: "./db/db.sqlite3"
    },
    useNullAsDefault: true
})

module.exports = db;