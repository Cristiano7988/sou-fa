const { generateAccessToken, getExpiration } = require("../../app/helpers");
const bcrypt = require("bcrypt");
const [nodePath, serverPath, env_file = ".env.local"] = process.argv;
require("dotenv").config({ path: ".env.local" });

const saveToken = async (req) => {
    const { usuario } = req;
    const { expiresAt } = await getExpiration();
    const { rawAccessToken, accessToken } = await generateAccessToken();

    usuario.expiresAt = expiresAt;
    usuario.accessToken = rawAccessToken;
    await usuario.save();

    usuario.accessToken = accessToken;

    return usuario;
}

exports.create = async (req, res) => {
    try {
        let { usuario } = req;
        const { senha } = req.body;
        
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).send({ message: "Senha inválida." });

        usuario = await saveToken(req);
 
        return res.send({ usuario });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.update = async (req, res) => {
    try {
        const usuario = await saveToken(req);

        return res.send({ usuario });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

exports.destroy = async (req, res) => {
    try {
        let { usuario } = req;

        usuario.expiresAt = null;
        usuario.accessToken = null;
        await usuario.save();

        return res.send({ usuario });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
