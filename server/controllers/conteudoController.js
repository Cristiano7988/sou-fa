const { Op } = require("sequelize");
const { Conteudo } = require("../../app/models");

exports.list = async (req, res) => {
    try {
        const { usuarioId = "*"} = req.query;

        let conteudos = await Conteudo.findAll({
            where: {
                usuarioId: {
                    [Op.not]: usuarioId
                }
            }
        });

        conteudos = await Promise.all(conteudos.map(async conteudo => await {
            ...conteudo.dataValues,
            pagamentos: await conteudo.getPagamentos({
                where: {
                    usuarioId
                }
            })
        }));

        return res.send({ conteudos });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

exports.create = async (req, res) => {
    try {
        const { usuario } = req;
        const { titulo, descricao, url, valorDoConteudo, valorDaMensagem } = req.body;

        let conteudo = Conteudo.build({ titulo, descricao, url, valorDoConteudo, valorDaMensagem, usuarioId: usuario.id });
        await conteudo.save();
        
        return res.send({ conteudo });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
