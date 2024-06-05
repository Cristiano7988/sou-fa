import { useEffect, useState } from "react"
import { AppInput } from "../../ui/components/AppInput";
import { AppButton } from "../../ui/components/AppButton";
import { useApp } from "../../data/hooks/useApp";
import { useNavigate } from "react-router-dom";
import { possui } from "../../data/helpers/possui";

export const CreateConteudos = () => {
    const { usuario, atualizaMensagem } = useApp();
    const [data, setData] = useState({});
    const navigate = useNavigate();

    if (!usuario) navigate("/");

    const { REACT_APP_NODE_URL } = process.env;
    const url = [REACT_APP_NODE_URL, "users", usuario?.id, "conteudos"].join("/");


    const updateData = (item) => {
        setData({
            ...data,
            ...item
        });
    }

    const salvarConteudo = async (e) => {
        if (possui.erros(data)) return true;

        const camposAusentes = possui.camposAusentes(data, ["titulo", "descricao", "midia", "valorDoConteudo"])
        if (camposAusentes) {
            atualizaMensagem(camposAusentes);
            return true;
        }

        const formData = new FormData();
        Object.entries(data).map(([chave, valor]) => formData.append(chave, valor)); 

        return await fetch(url, {
            method: "POST",
            body: formData
        })
        .then(r => r.json())
        .then(() => navigate("/conteudos", { state: { mensagem: "Conteúdo Criado", sucesso: true }}))
        .catch(e => {
            atualizaMensagem(e.message);
            return true;
        })
    }

    return <div className="app-card-container">
        <h1 children="Conteúdo" />

        <div className="app-card">
            <AppInput
                required
                placeholder="Título"
                updateData={updateData}
            />

            <AppInput
                required
                placeholder="Descrição"
                updateData={updateData}
            />

            <AppInput
                required
                placeholder="Mídia"
                type="file"
                updateData={updateData}
            />

            <AppInput
                required
                type="number"
                step="0.1"
                placeholder="Valor do conteúdo"
                updateData={updateData}
            />

            <AppButton
                children="Salvar"
                asyncEvent={salvarConteudo}
            />
        </div>
    </div>
}
