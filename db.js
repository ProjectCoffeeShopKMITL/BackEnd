const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "post1234",
    host: "localhost",
    port: 5432,
    database: "coffeeshop"
});

module.exports = pool;