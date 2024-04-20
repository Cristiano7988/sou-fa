const [nodePath, serverPath, env_file = ".env.local"] = process.argv;
require("dotenv").config({ path: env_file });
const { Payment, MercadoPagoConfig, PaymentMethod, IdentificationType } = require("mercadopago");
const { v4: uuidv4 } = require('uuid');
const { Pagamento, Conteudo } = require("../../app/models");
const configDoApp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Pagamentos
exports.payments_create = async (req, res) => {
    try {
        const { transaction_amount, token , description, installments, payment_method_id, issuer_id, payer } = req.body;
        const { email, identification } = payer;
        const { type, number } = identification;
        const { conteudoId } = req.body;

        const conteudo = await Conteudo.findByPk(conteudoId);
        if (!conteudo) return res.status(404).send({ message: "Conteúdo não encontrado" });


        const payment = await new Payment(configDoApp).create({
            body: { 
                transaction_amount,
                token,
                description,
                installments,
                payment_method_id,
                issuer_id,
                payer: {
                    email,
                    identification: { type, number }
                }
            },
            requestOptions: { idempotencyKey: uuidv4() }
        });

        if (payment) {
            const { usuario } = req;

            let pagamento = Pagamento.build({
                valorPago: transaction_amount,
                usuarioId: usuario.id,
                mercadoPagoPaymentId: payment.id,
                conteudoId
            });
            await pagamento.save();

            return res.send({ payment, pagamento });
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Meios de Pagamento
exports.payment_methods = async (req, res) => {
    try {
        let meiosDePagamento = await new PaymentMethod(configDoApp).get();

        meiosDePagamento = meiosDePagamento.filter(meio => /card/.test(meio.payment_type_id));

        if (meiosDePagamento) return res.send({ meiosDePagamento });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Tipos de documentos
exports.identification_types = async (req, res) => {
    try {
        const identification_types = await new IdentificationType(configDoApp).list();

        if (identification_types) return res.send({ identification_types });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
