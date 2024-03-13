const [nodePath, serverPath, env_file = ".env.local"] = process.argv;
require("dotenv").config({ path: ".env.local" });

module.exports = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_URL,
    dialect: process.env.DB_TYPE,
}
