'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
        class Conteudo extends Model {
            /**
             * Helper method for defining associations.
             * This method is not a part of Sequelize lifecycle.
             * The `models/index` file will call this method automatically.
             */
        static associate(models) {
            Conteudo.hasMany(models.Pagamento);
            Conteudo.belongsTo(models.Usuario);
        }
    }
    Conteudo.init({
        titulo: DataTypes.STRING,
        descricao: DataTypes.STRING,
        url: DataTypes.STRING,
        largura: DataTypes.INTEGER,
        altura: DataTypes.INTEGER,
        valorDoConteudo: DataTypes.FLOAT,
        valorDaMensagem: DataTypes.FLOAT,
        usuarioId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Conteudo',
    });
    return Conteudo;
};
