const { generateAccessToken, getExpiration } = require("../../app/helpers");
const { Usuario } = require("../../app/models");
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
    try {
        const { email, senha } = req.body;

        let usuario = await Usuario.findOne({ where: { email } });
        if (usuario) return res.status(403).send({ message: "Email já cadastrado." })

        const { expiresAt } = await getExpiration();
    
        const { rawAccessToken } = await generateAccessToken();
        const accessToken = await bcrypt.hash(rawAccessToken, 10);
    
        usuario = Usuario.build({ email, senha, expiresAt, accessToken: rawAccessToken });
        await usuario.save();

        usuario.accessToken = accessToken;
        
        return res.send({ usuario });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
