'use strict';
const {
    Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
    class Usuario extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Usuario.hasMany(models.Pagamento);
            Usuario.hasMany(models.Conteudo);
        }
    }
    Usuario.init({
        email: DataTypes.STRING,
        senha: DataTypes.STRING,
        accessToken: DataTypes.STRING,
        expiresAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Usuario',
        hooks: {
            beforeCreate: async (usuario) => {
                const hashedPassword = await bcrypt.hash(usuario.senha, 10);
                usuario.senha = hashedPassword;
            },
            beforeUpdate: async (usuario) => {
                if (usuario.changed("senha")) {
                    const hashedPassword = await bcrypt.hash(usuario.senha, 10);
                    usuario.senha = hashedPassword;
                }
            },
        },
  });
  return Usuario;
};
