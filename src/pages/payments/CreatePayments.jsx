import { AppButton } from "../../ui/components/AppButton";
import { useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { useEffect } from "react";
import { useApp } from "../../data/hooks/useApp";
import { MonetizationOn } from "@mui/icons-material";
import { AppInput } from "../../ui/components/AppInput";

await loadMercadoPago();

export const CreatePayments = ({ conteudoInicial }) => {
    const [conteudo, setConteudo] = useState(conteudoInicial);
    const [iniciarPagamento, setIniciarPagamento] = useState(false);
    const [dadosDaCompra, setDadosDaCompra] = useState(false);
    const [tiposDeDocumento, setTiposDeDocumento] = useState([]);
    const [cartoesDeCredito, setCartoesDeCredito] = useState([]);
    const [cartoesDeDebito, setCartoesDeDebito] = useState([]);
    const { REACT_APP_NODE_URL, REACT_APP_MP_PUBLIC_KEY } = process.env;
    const { usuario, atualizaMensagem } = useApp();
    const [pagamento, setPagamento] = useState(conteudo.pagamento || !conteudo.valorDoConteudo || (conteudo.usuarioId == usuario?.id));
    const { id } = conteudo;

    const navegaEntreEtapas = async () => {
        setDadosDaCompra(!dadosDaCompra);
        return true;
    }

    useEffect(() => {
        if (!iniciarPagamento) return;

        paymentMethods();
        identificationTypes();

        let formItens = [
            ["cardNumber", "Número do cartão"],
            ["expirationDate", "MM/AA"],
            ["securityCode", "Código de segurança"],
            ["cardholderName", "Titular do cartão"],
            ["issuer", "Banco emissor"],
            ["installments", "Parcelas"],
            ["identificationType", "Tipo de documento"],
            ["identificationNumber", "Número do documento"],
            ["cardholderEmail", "E-mail"],
        ]?.map(([identification, placeholder]) => ({ [identification]: { id: identification + id, placeholder } }));

        formItens = Object.assign({}, ...formItens);

        const mp = new window.MercadoPago(REACT_APP_MP_PUBLIC_KEY, {
            locale: "pt-BR",
        });

        const cardForm = mp.cardForm({
            amount: String(conteudo.valorDoConteudo),
            iframe: true,
            form: {
                id: "form-checkout" + id,
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
                    atualizaMensagem(<div>
                        Dados inválidos:
                        <ul>
                            {error?.map((erro, key) => <li key={key} children={erro.message} />)}
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
                atualizaMensagem(e.message ?? "Não foi possível obter os meios de pagamento");
                return true;
            })
    }

    // Pagamentos
    const proccessPaymentCreate = async (card) => {
        const url = [REACT_APP_NODE_URL, "users", usuario.id, "payments"].join("/");
          
        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                conteudoId: conteudo.id,
                token: card.token,
                issuer_id: card.issuerId,
                payment_method_id: card.paymentMethodId,
                transaction_amount: Number(conteudo.valorDoConteudo),
                installments: Number(card.installments),
                description: conteudo.titulo,
                payer: {
                    email: card.cardholderEmail,
                    identification: {
                        type: card.identificationType,
                        number: card.identificationNumber,
                    },
                },
            }),
        })
        .then(r => r.json())
        .then(({ payment, pagamento }) => {
            setIniciarPagamento(false);
            setPagamento(pagamento);

            const url = [REACT_APP_NODE_URL, "conteudos", conteudo.id].join("/");
            const query = `?paymentId=${payment.id}&pagamentoId=${pagamento.id}`;
            fetch(url + query)
                .then(r => r.json())
                .then(({ conteudo }) => setConteudo({
                    ...conteudo,
                    pagamento
                }))
                .catch(error => {
                    const message = /fetch/.test(error.message)
                        ? "Nosso servidor está temporaramente indisponível."
                        : error.message;
    
                    atualizaMensagem(message);
                })
            return true;
        })
        .catch(error => {
            const message = /fetch/.test(error.message)
                ? "Nosso servidor está temporaramente indisponível."
                : error.message;

            atualizaMensagem(message);
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

                atualizaMensagem(message);
                return true;
            });
    }

    const mostrarDadosDoCartao = dadosDaCompra ? "hidden" : "";
    const mostrarDadosDaCompra = !dadosDaCompra ? "hidden" : "";

    return <div className="app-card-container">
        <div className="app-card">
            <div className="container-do-conteudo">
                <div className="identificacao-do-usuario">
                    <div className="autor-do-conteudo" children={conteudo.Usuario?.email[0]} />
                    <p children={conteudo.Usuario?.email} />
                </div>
                <img
                    title={conteudo.liberado ? conteudo.titulo : "Para liberar efetue o pagamento."}
                    src={conteudo.url}
                />
            </div>

            <div className="container-de-interacoes">

                {!pagamento && <MonetizationOn
                    onClick={() => setIniciarPagamento(!iniciarPagamento)}
                    className="card-icon"
                />}
            </div>

            <div className="checkout">
                {iniciarPagamento && <form id={"form-checkout" + id}>
                    <span>
                        <b children="Valor: " />
                        { conteudo.valorDoConteudo.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) }
                    </span>
                    <div id={"cardNumber" + id} className={["container", mostrarDadosDoCartao].join(" ")} />
                    <div className="par-de-campos-pequenos">
                        <div id={"expirationDate" + id} className={["container", mostrarDadosDoCartao].join(" ")} />
                        <div id={"securityCode" + id} className={["container", mostrarDadosDoCartao].join(" ")} />
                    </div>
                    <AppInput id={"cardholderName" + id} className={mostrarDadosDoCartao} />

                    <select id={"issuer" + id} className={mostrarDadosDaCompra} />
                    <select id={"installments" + id} className={mostrarDadosDaCompra} />
                    <div className="par-de-campos-pequenos">
                        <select id={"identificationType" + id} className={mostrarDadosDaCompra} />
                        <AppInput id={"identificationNumber" + id} className={mostrarDadosDaCompra} />
                    </div>
                    <input type="email" id={"cardholderEmail" + id} className="hidden" defaultValue={usuario.email} />

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
