const knex = require('knex');

//Create a Knex instance to access User DB
const db = knex({
    client: 'sqlite3',
    connection: {
        filename: "./db/db.sqlite3"
    }
})

module.exports = db;