const fs = require("fs");

const filenames = fs.readdirSync("./server/migrations");
filenames.pop(); // Remove index.js
filenames.pop(); // Remove index-rollback.js

if (!filenames.length) return console.log("Não há migrations para rodar")

filenames.reverse();

filenames.map((file, index) => {
    const { doMigrate } = require("./" + file);

    if (index == filenames.length - 1) {
        // console.log("Executando última migration");
        setTimeout(() => {
            console.log("Encerrando criações de migrations");
            process.exit()
        }, 3000);
    }
    
    doMigrate();
});
