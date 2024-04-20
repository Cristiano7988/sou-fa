'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        queryInterface.addConstraint('Conteudos', {
            fields: ['usuarioId'],
            type: 'foreign key',
            name: 'conteudo_usuario_association',
            references: {
                table: 'usuarios',
                field: 'id'
            }
        });
    },

    async down (queryInterface, Sequelize) {
        queryInterface.removeConstraint('Conteudos', 'conteudo_usuario_association', {
            fields: ['usuarioId'],
            type: 'foreign key',
            name: 'conteudo_usuario_association',
            references: {
                table: 'usuarios',
                field: 'id'
            }
        });
    }
};
