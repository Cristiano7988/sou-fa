import { AppButton } from "../../ui/components/AppButton";
import { useState } from "react";
import { Alert } from "@mui/material";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { useEffect } from "react";
import { useApp } from "../../data/hooks/useApp";
import { MonetizationOn } from "@mui/icons-material";
import { AppInput } from "../../ui/components/AppInput";

await loadMercadoPago();

export const CreatePayments = () => {
    const [iniciarPagamento, setIniciarPagamento] = useState(false);
    const [dadosDaCompra, setDadosDaCompra] = useState(false);
    const [tiposDeDocumento, setTiposDeDocumento] = useState([]);
    const [cartoesDeCredito, setCartoesDeCredito] = useState([]);
    const [cartoesDeDebito, setCartoesDeDebito] = useState([]);
    const [pagamento, setPagamento] = useState(null);
    const [mensagem, setMensagem] = useState(false);
    const { REACT_APP_NODE_URL, REACT_APP_MP_PUBLIC_KEY } = process.env;
    const { usuario } = useApp();

    const navegaEntreEtapas = async () => {
        setDadosDaCompra(!dadosDaCompra);
        return true;
    }

    useEffect(() => {
        if (!cartoesDeCredito || !cartoesDeDebito) return;

        paymentMethods();
        identificationTypes();
    }, []);

    useEffect(() => {
        if (!iniciarPagamento) return;

        let formItens = [
            ["cardNumber", "Número do cartão"],
            ["expirationDate", "MM/AA"],
            ["securityCode", "Código de segurança"],
            ["cardholderName", "Titular do cartão"],
            ["cardholderName", "Titular do cartão"],
            ["issuer", "Banco emissor"],
            ["installments", "Parcelas"],
            ["identificationType", "Tipo de documento"],
            ["identificationNumber", "Número do documento"],
            ["cardholderEmail", "E-mail"],
        ].map(([id, placeholder]) => ({ [id]: { id, placeholder } }));

        formItens = Object.assign({}, ...formItens);

        const mp = new window.MercadoPago(REACT_APP_MP_PUBLIC_KEY, {
            locale: "pt-BR",
        });

        const cardForm = mp.cardForm({
            amount: "100.5",
            iframe: true,
            form: {
                id: "form-checkout",
                ...formItens,
            },
            callbacks: {
                onFormMounted: error => {
                    if (error) return console.warn("Formulário montado lidando com o erro: ", error);
                    console.log("Formulário montado");
                },
                onSubmit: event => {
                    event.preventDefault();

                    proccessPaymentCreate(cardForm.getCardFormData());
                },
                onFetching: (resource) => {
                    console.log("Buscando recurso: ", resource);

                    const progressBar = document.querySelector(".progress-bar");
                    progressBar.removeAttribute("value");
            
                    return () => progressBar.setAttribute("value", "0");
                },
                onError: (error) => {
                    setMensagem(<div>
                        Dados inválidos:
                        <ul>
                            {error.map((erro, key) => <li key={key} children={erro.message} />)}
                        </ul>
                    </div>);
                }
            },
        });

        return () => cardForm.unmount();
    }, [iniciarPagamento]);

    // Meios de Pagamento
    const paymentMethods = async () => {
        const url = [REACT_APP_NODE_URL, "payment_methods"].join("/");
        return await fetch(url)
            .then(r => r.json())
            .then(({ meiosDePagamento }) => {
                const cartoesDeCredito = meiosDePagamento.filter(meioDePagamento => /credit_card/.test(meioDePagamento.payment_type_id));
                setCartoesDeCredito(cartoesDeCredito);
                
                const cartoesDeDebito = meiosDePagamento.filter(meioDePagamento => /debit_card/.test(meioDePagamento.payment_type_id));
                setCartoesDeDebito(cartoesDeDebito);
                return true;
            })
            .catch(e => {
                console.log(e);
                return true;
            })
    }

    // Pagamentos
    const proccessPaymentCreate = async ({
        paymentMethodId: payment_method_id,
        issuerId: issuer_id,
        cardholderEmail: email,
        amount,
        token,
        installments,
        identificationNumber,
        identificationType,
    }) => {
        const url = [REACT_APP_NODE_URL, "users", 1, "payments"].join("/");
          
        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                issuer_id,
                payment_method_id,
                transaction_amount: Number(amount),
                installments: Number(installments),
                description: "Descrição do produto",
                payer: {
                    email,
                    identification: {
                        type: identificationType,
                        number: identificationNumber,
                    },
                },
            }),
        })
        .then(r => r.json())
        .then(({ payment }) => {
            setPagamento(payment);
            setIniciarPagamento(false);
            return true;
        })
        .catch(error => {
            const message = /fetch/.test(error.message)
                ? "Nosso servidor está temporaramente indisponível."
                : error.message;

            setMensagem(message);
            return true;
        });
    }

   // Tipos de documentos
    const identificationTypes = async () => {
        const url = [REACT_APP_NODE_URL, "identification_types"].join("/");

        return await fetch(url)
            .then(r => r.json())
            .then(({ identification_types }) => {
                setTiposDeDocumento(identification_types);
                return true;
            })
            .catch(error => {
                const message = /fetch/.test(error.message)
                    ? "Nosso servidor está temporaramente indisponível."
                    : error.message;

                setMensagem(message);
                return true;
            });
    }

    const mostrarDadosDoCartao = dadosDaCompra ? "hidden" : "";
    const mostrarDadosDaCompra = !dadosDaCompra ? "hidden" : "";

    return <div>
        {mensagem && <Alert
            className="mensagem-de-erro"
            variant="filled"
            severity="error"
            children={mensagem}
            onClose={() => setMensagem("")}
        />}

        <h1 children="Pagamento" />

        <div className="app-card">
            {!pagamento && <MonetizationOn
                onClick={() => setIniciarPagamento(!iniciarPagamento)}
                className="card-icon"
            />}

            <div className="checkout">
                {iniciarPagamento && <form id="form-checkout">
                    <div id="cardNumber" className={["container", mostrarDadosDoCartao].join(" ")} />
                    <div className="par-de-campos-pequenos">
                        <div id="expirationDate" className={["container", mostrarDadosDoCartao].join(" ")} />
                        <div id="securityCode" className={["container", mostrarDadosDoCartao].join(" ")} />
                    </div>
                    <AppInput id="cardholderName" className={mostrarDadosDoCartao} />

                    <select id="issuer" className={mostrarDadosDaCompra} />
                    <select id="installments" className={mostrarDadosDaCompra} />
                    <div className="par-de-campos-pequenos">
                        <select id="identificationType" className={mostrarDadosDaCompra} />
                        <AppInput id="identificationNumber" className={mostrarDadosDaCompra} />
                    </div>
                    <AppInput type="email" id="cardholderEmail" className={mostrarDadosDaCompra} />

                    <progress value="0" className="progress-bar" children="Carregando..." />
                    <div className="botoes-de-acao">
                        {<AppButton asyncEvent={navegaEntreEtapas} children={dadosDaCompra ? "Voltar" : "Avançar"} />}
                        {dadosDaCompra && <AppButton type="submit" id="submit" children="Pagar" />}
                    </div>
                </form>}

                {iniciarPagamento && <div className="opcoes-de-cartao">
                    <div>
                        <b>Crédito</b>
                        <div
                            className="thumbnails-dos-cartoes"
                            children={cartoesDeCredito?.map(({ id, name, thumbnail }) => <img key={id} title={name} src={ thumbnail } />)}
                        />
                    </div>
                    <div>
                        <b>Débito</b>
                        <div
                            className="thumbnails-dos-cartoes"
                            children={cartoesDeDebito?.map(({ id, name, thumbnail }) => <img key={id} title={name} src={ thumbnail } />)}
                        />
                    </div>
                </div>}
            </div>
        </div>
    </div>
}
