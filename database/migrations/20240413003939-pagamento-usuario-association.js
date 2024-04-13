'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        queryInterface.addConstraint('Pagamentos', {
            fields: ['usuarioId'],
            type: 'foreign key',
            name: 'pagamento_usuario_association',
            references: {
                table: 'usuarios',
                field: 'id'
            }
        });
    },

    async down (queryInterface, Sequelize) {
        queryInterface.removeConstraint('Pagamentos', 'pagamento_usuario_association', {
            fields: ['usuarioId'],
            type: 'foreign key',
            name: 'pagamento_usuario_association',
            references: {
                table: 'usuarios',
                field: 'id'
            }
        });
    }
};
