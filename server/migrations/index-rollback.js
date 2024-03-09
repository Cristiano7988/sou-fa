const fs = require("fs");

const filenames = fs.readdirSync("./server/migrations");
filenames.pop(); // Remove index.js
filenames.pop(); // Remove index-rollback.js

if (!filenames.length) return console.log("Não há migrations para desfazer")

filenames.reverse();

filenames.map((file, index) => {
    const { undoMigrate } = require("./" + file);

    if (index == filenames.length - 1) {
        setTimeout(() => {
            console.log("Encerrando rollback de migrations");
            process.exit()
        }, 3000);
    }
    
    undoMigrate();
});
