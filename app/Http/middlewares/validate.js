const { getExpiration } = require("../../helpers");
const { Usuario } = require("../../models");
const bcrypt = require("bcrypt");

const accessToken = async (req, res, next) => {
    try {
        const { usuario } = req;

        const { accessToken } = req.body;
        if (!accessToken) return res.status(401).send({ message: "Este usuário está deslogado." });

        const tokenValido = await bcrypt.compare(usuario.accessToken, accessToken);
        if (!tokenValido) return res.status(401).send({ message: "Token inválido." });

        const { today } = await getExpiration();

        if (usuario.expiresAt < today) {
            usuario.accessToken = null;
            usuario.expiresAt = null;
            usuario.save();
            return res.status(401).send({ message: "Token expirado." });
        }

        return next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const user = async (req, res, next) => {
    try {
        const { email } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) return res.status(401).send({ message: "Este email não está cadastrado." });
    
        req.usuario = usuario;
        return next();
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const validate = {
    accessToken,
    user
}

module.exports = validate;
