const { Conteudo, Pagamento, Usuario } = require("../../app/models");
const { Payment, MercadoPagoConfig } = require("mercadopago");
const { makeItBlur, addWaterMark } = require("../../app/helpers");
const [nodePath, serverPath, env_file = ".env.local"] = process.argv;
require("dotenv").config({ path: env_file });
const configDoApp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

exports.list = async (req, res) => {
    try {
        const include = [
            {
                model: Usuario,
                attributes: [ "id", "email"]
            }
        ];

        const limit = 5;
        const { usuarioId = "*", filter = false, offset } = req.query;
        let where = {};

        switch (filter) {
            case "mine":
                where = { usuarioId };
                break;
            case "payed":
                include.push({
                    model: Pagamento,
                    where: {
                        usuarioId
                    }
                });
                break;
        }

        let conteudos = await Conteudo.findAll({
            where,
            include,
            limit,
            offset: Number(offset * limit),
            order: [
                ['createdAt', 'DESC']
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

        const conteudo = await Conteudo.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    attributes: [ "id", "email"]
                }
            ]
        });
        if (!conteudo) return res.status(404).send({ message: "Conteúdo não encontrado." });

        const { paymentId, pagamentoId } = req.query;
 
        const pagamento = await Pagamento.findByPk(pagamentoId);
        if (!pagamento) return res.status(402).send({ message: "Pagamento não efetuado." });

        const payment = await new Payment(configDoApp).get({ id: paymentId });
        if (!payment) return res.status(402).send({ message: "Pagamento não processado no Mercado Pago." });

        const { url, altura, largura } = conteudo;
        conteudo.url = await addWaterMark(url, largura, altura);
        conteudo.liberado = true;

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
