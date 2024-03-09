const { database } = require("../connections");

exports.doMigrate = () => database.getConnection((err) => {
    if (err) throw err;
    console.log("create_migrations_table rodando...");

    const colunas = [
        "id INT AUTO_INCREMENT PRIMARY KEY",
        "migrated BOOL default 0",
        "name VARCHAR(255)"
    ].join(", ");

    var sql = `CREATE TABLE migrations (${colunas})`;
    database.query(sql, (err) => {
        if (err) return console.log(err.sqlMessage);
        console.log("09032024_164758_create_migrations_table.js migrada!");

        database.query("INSERT INTO migrations (name, migrated) VALUES ('09032024_164758_create_migrations_table.js', 1)", (err) => {
            if (err) return console.log(err.sqlMessage);
            console.log("09032024_164758_create_migrations_table.js registrada.");
        });
    });
});

exports.undoMigrate = () => database.getConnection((err) => {
    // if (err) throw err;
    // console.log("create_migrations_table está sendo desfeita.");

    // var sql = "DROP TABLE migrations";
    // database.query(sql, (err, result) => {
    //     if (err) return console.log(err.sqlMessage);
    //     console.log("create_migrations_table desfeita!");
    // });
});
