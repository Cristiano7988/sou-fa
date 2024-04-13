'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Pagamentos', {
            id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
            },
            valorPago: {
                type: Sequelize.FLOAT
            },
            formaDePagamentoId: {
                type: Sequelize.INTEGER,
                allowNull: true // Remover após inserir formas de pagamento
            },
            conteudoId: {
                type: Sequelize.INTEGER,
                allowNull: true // Remover após inserir conteúdos
            },
            usuarioId: {
                type: Sequelize.INTEGER
            },
            mensagemId: {
                type: Sequelize.INTEGER,
                allowNull: true // Remover após inserir mensagens
            },
            mercadoPagoPaymentId: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Pagamentos');
    }
};
