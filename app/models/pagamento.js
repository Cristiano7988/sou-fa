'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Pagamento extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Pagamento.belongsTo(models.Usuario, { foreignKey: "usuarioId"  });
            Pagamento.belongsTo(models.Conteudo);
        }
    }
    Pagamento.init({
        valorPago: DataTypes.FLOAT,
        formaDePagamentoId: DataTypes.INTEGER,
        conteudoId: DataTypes.INTEGER,
        mensagemId: DataTypes.INTEGER,
        usuarioId:  DataTypes.INTEGER,
        mercadoPagoPaymentId:  DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Pagamento',
    });
    return Pagamento;
};
