import { useState } from "react"
import { AppInput } from "../../ui/components/AppInput";
import { AppButton } from "../../ui/components/AppButton";
import { useApp } from "../../data/hooks/useApp";

export const CreateConteudos = () => {
    const { REACT_APP_NODE_URL } = process.env;
    const { usuario } = useApp();

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [url, setURL] = useState("");
    const [valorDoConteudo, setValorDoConteudo] = useState("");
    const [valorDaMensagem, setValorDaMensagem] = useState("");

    const changeTitulo = (e) => setTitulo(e.target.value);
    const changeDescricao = (e) => setDescricao(e.target.value);
    const changeURL = (e) => setURL(e.target.value);
    const changeValorDoConteudo = (e) => setValorDoConteudo(e.target.value);
    const changeValorDaMensagem = (e) => setValorDaMensagem(e.target.value);

    const salvarConteudo = async () => {
        return await fetch([REACT_APP_NODE_URL, "users", usuario.id, "conteudos"].join("/"), {
            method: "POST",
            body: JSON.stringify({
                titulo,
                descricao,
                url,
                valorDoConteudo,
                valorDaMensagem
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(r => r.json())
        .catch(console.log)
    }

    return <div>
        <h1 children="Conteúdo" />

        <div className="app-card">
            <AppInput
                placeholder="Título"
                value={titulo}
                handleChange={changeTitulo}
            />

            <AppInput
                placeholder="Descrição"
                value={descricao}
                handleChange={changeDescricao}
            />

            <AppInput
                type="file"
                value={url}
                handleChange={changeURL}
            />

            <AppInput
                type="number"
                step="0.1"
                placeholder="Valor do conteúdo"
                value={valorDoConteudo}
                handleChange={changeValorDoConteudo}
            />

            <AppInput
                type="number"
                step="0.1"
                placeholder="Valor de Mensagem"
                value={valorDaMensagem}
                handleChange={changeValorDaMensagem}
            />

            <AppButton
                children="Salvar"
                asyncEvent={salvarConteudo}
            />
        </div>
    </div>
}
