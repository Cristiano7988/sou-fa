const [nodePath, serverPath, env_file = ".env.local"] = process.argv;
require("dotenv").config({ path: env_file });

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let ambiente = "Desenvolvimento";
if (["prod", "production"].includes(process.env.NODE_ENV.toLowerCase())) ambiente = "Produção";

console.log(`*** Ambiente de ${ambiente} ***\nServidor rodando no ambiente de ${ambiente}!\n`)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Port: ${PORT}`);
});
