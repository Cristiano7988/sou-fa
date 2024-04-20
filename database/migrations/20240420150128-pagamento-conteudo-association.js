'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        queryInterface.addConstraint('Pagamentos', {
            fields: ['conteudoId'],
            type: 'foreign key',
            name: 'pagamento_conteudo_association',
            references: {
                table: 'conteudos',
                field: 'id'
            }
        });
    },

    async down (queryInterface, Sequelize) {
        queryInterface.removeConstraint('Pagamentos', 'pagamento_conteudo_association', {
            fields: ['conteudoId'],
            type: 'foreign key',
            name: 'pagamento_conteudo_association',
            references: {
                table: 'conteudos',
                field: 'id'
            }
        });
    }
};
