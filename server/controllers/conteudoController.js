const { Op } = require("sequelize");
const { Conteudo, Pagamento, Usuario } = require("../../app/models");
const { Payment, MercadoPagoConfig } = require("mercadopago");
const { makeItBlur, addWaterMark } = require("../../app/helpers");
const [nodePath, serverPath, env_file = ".env.local"] = process.argv;
require("dotenv").config({ path: env_file });
const configDoApp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

exports.list = async (req, res) => {
    try {
        const { usuarioId = "*"} = req.query;

        let conteudos = await Conteudo.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: [ "id", "email"]
                }
            ]
        });

        conteudos = await Promise.all(conteudos.map(async conteudo => {
            const [pagamento] = await conteudo.getPagamentos({
                where: {
                    usuarioId
                }
            });

            const { id, titulo, descricao, url, largura, altura, valorDoConteudo, valorDaMensagem, Usuario } = conteudo;
            const liberado = pagamento || !valorDoConteudo || conteudo.usuarioId == usuarioId;

            return await {
                id,
                titulo,
                descricao,
                valorDoConteudo,
                valorDaMensagem,
                url: liberado ? await addWaterMark(url, largura, altura) : await makeItBlur(url, largura, altura),
                pagamento,
                liberado,
                usuarioId: Usuario.id,
                Usuario
            }
        }));

        return res.send({ conteudos });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

exports.get = async (req, res) => {
    try {
        const { id } = req.params;

        const conteudo = await Conteudo.findByPk(id);
        if (!conteudo) return res.status(404).send({ message: "Conteúdo não encontrado." });

        const { paymentId, pagamentoId } = req.query;
 
        const pagamento = await Pagamento.findByPk(pagamentoId);
        if (!pagamento) return res.status(402).send({ message: "Pagamento não efetuado." });

        const payment = await new Payment(configDoApp).get({ id: paymentId });
        if (!payment) return res.status(402).send({ message: "Pagamento não processado no Mercado Pago." });

        res.send({ conteudo });
    } catch (error) {
        return res.status(500).send({ error });
    }

}

exports.create = async (req, res) => {
    try {
        const { usuario } = req;
        const { titulo, descricao, midia, valorDoConteudo, valorDaMensagem, largura, altura } = req.body;

        let conteudo = Conteudo.build({ titulo, descricao, url: midia, largura, altura, valorDoConteudo, valorDaMensagem, usuarioId: usuario.id });
        await conteudo.save();
        
        return res.send({ conteudo });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
