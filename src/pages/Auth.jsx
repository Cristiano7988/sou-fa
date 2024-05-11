import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../data/hooks/useApp";
import { useEffect, useState } from "react";
import { AppButton } from "../ui/components/AppButton";
import { AppInput } from "../ui/components/AppInput";
import { possui } from "../data/helpers/possui";

export const Auth = () => {
    const { usuario, setUsuario, atualizaMensagem } = useApp();
    const [data, setData] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const title = location.pathname.replace("/", "");

    useEffect(() => {
        if (usuario) return navigate("/conteudos", { state: { mensagem: "Usuário logado", sucesso: true } }); 
        atualizaMensagem(location.state?.mensagem ?? "", location.state?.sucesso ?? false);
    }, [usuario]);

    const updateData = (item) => {
        setData({
            ...data,
            ...item
        });
    }

    const concedeAcesso = async () => {
        if (possui.erros(data)) return true;

        const camposAusentes = possui.camposAusentes(data, ["email", "senha"]);
        if (camposAusentes) {
            atualizaMensagem(camposAusentes);
            return true;
        }

        const nodeURL = process.env.REACT_APP_NODE_URL;
        const url = !title
            ? [nodeURL, "auth", "login"].join("/")
            : [nodeURL, "usuario"].join("/");

        return await fetch(url, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            if (response.usuario) {
                setUsuario(response.usuario);
            } else {
                atualizaMensagem(response.message);
            }
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

    return <div className="app-card">
        <h1 children={!title ? "Login" : "Cadastro"} />

        <AppInput
            type="email"
            placeholder="Email"
            required
            updateData={updateData}
        />

        <AppInput 
            type="password"
            placeholder="Senha"
            required
            updateData={updateData}
        />

        {data && <AppButton
            children="Entrar"
            asyncEvent={concedeAcesso}
        />}
    </div>
};
