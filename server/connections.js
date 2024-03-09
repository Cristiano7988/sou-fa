const [nodePath, serverPath, env_file = ".env.local"] = process.argv;
require("dotenv").config({ path: env_file });

const mysql = require("mysql");

exports.database = mysql.createPool({
    host: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
