"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Conteudos", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            titulo: {
                type: Sequelize.STRING,
            },
            descricao: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            url: {
                type: Sequelize.STRING,
            },
            largura: {
                type: Sequelize.INTEGER,
            },
            altura: {
                type: Sequelize.INTEGER,
            },
            valorDoConteudo: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            valorDaMensagem: {
                type: Sequelize.FLOAT,
                allowNull: true,
            },
            usuarioId: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Conteudos");
    },
};
