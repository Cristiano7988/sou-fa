const fs = require("fs");

const dia = new Date().toLocaleDateString().replaceAll("/", "");
const horario = new Date().toLocaleTimeString().replaceAll(":", "");
const [nodePath, serverPath, nome] = process.argv;

if (!nome) return console.log("Nomeie o arquivo a ser criado\nEx.: create_exemplos_table");

const nomeDoArquivo =  [dia, horario, nome + ".js"].join("_");
const arquivo = "server/migrations/" + nomeDoArquivo.toLowerCase();

const [metodo, tabela, item] = nome.split("_");

const colunaId = metodo.toLocaleUpperCase() == "DROP"
    ? ""
    : "(id INT AUTO_INCREMENT PRIMARY KEY)";

const undo = metodo.toLocaleUpperCase() == "DROP"
    ? "CREATE"
    : "DROP";

const conteudo = `const { database } = require("../connections");

exports.doMigrate = () => database.getConnection((err) => {
    if (err) throw err;
    console.log("${nome} rodando...");

    database.query("SELECT * FROM migrations WHERE name = '${nomeDoArquivo}' AND migrated = 1", (err, result, fields) => {
        if (err) throw err;
        if (result.length) return console.log('${nomeDoArquivo} já havia sido migrada.')
        
        database.query("INSERT INTO migrations (name, migrated) VALUES ('${nomeDoArquivo}', 1)", (err) => {
            if (err) return console.log(err.sqlMessage);
            console.log("${nomeDoArquivo} registrada.");
        });
        
        var sql = "${metodo.toUpperCase()} ${item.toUpperCase()} ${tabela.toLowerCase()} ${colunaId}";
        database.query(sql, (err) => {
            if (err) return console.log(err.sqlMessage);
            console.log("${nomeDoArquivo} migrada!");
        });
    });
});

exports.undoMigrate = () => database.getConnection((err) => {
    if (err) throw err;
    console.log("${nome} está sendo desfeita...");

    database.query("SELECT * FROM migrations WHERE name = '${nomeDoArquivo}' AND migrated = 0", (err, result, fields) => {
        if (err) throw err;
        if (result.length) return console.log('${nomeDoArquivo} já havia sido executado o rollback.')
        
        database.query("UPDATE migrations SET migrated = 0 WHERE name = '${nomeDoArquivo}'", (err, result) => {
            if (err) return console.log(err.sqlMessage);
            console.log("${nomeDoArquivo} registrada.");
        });
        
        var sql = "${undo} ${item.toUpperCase()} ${tabela.toLowerCase()}";
        database.query(sql, (err) => {
            if (err) return console.log(err.sqlMessage);
            console.log("${nomeDoArquivo} desfeita!");
        });
    
    });
});`

fs.writeFile(arquivo, conteudo, (err) => {
    if (err) return console.error(`Não foi possível criar a migration ${nomeDoArquivo} devido ao seguinte erro:`, err);
    console.log(`Migration ${nomeDoArquivo} criada.`);
});
