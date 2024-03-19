"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(
        "Usuarios",
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                email: {
                    type: Sequelize.STRING,
                    unique: true,
                    allowNull: false,
                },
                senha: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                accessToken: {
                    type: Sequelize.STRING,
                },
                expiresAt: {
                    type: Sequelize.DATE,
                },
                createdAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            },
        );
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Usuarios");
    },
};
