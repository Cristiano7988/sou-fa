const { generateAccessToken, getExpiration } = require("../../app/helpers");
const { Usuario } = require("../../app/models");
const bcrypt = require("bcrypt");

exports.create = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const { expiresAt } = await getExpiration();
    
        const { rawAccessToken } = await generateAccessToken();
        const accessToken = await bcrypt.hash(rawAccessToken, 10);
    
        let usuario = Usuario.build({ email, senha, expiresAt, accessToken: rawAccessToken });
        await usuario.save();

        usuario.accessToken = accessToken;
        
        return res.send({ usuario });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
