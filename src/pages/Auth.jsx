import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../data/hooks/useApp";
import { Alert } from "@mui/material";
import { useState } from "react";
import { AppButton } from "../ui/components/AppButton";
import { AppInput } from "../ui/components/AppInput";

export const Auth = () => {
    const { usuario, setUsuario } = useApp();
    const [mensagem, setMensagem] = useState(false);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaErrada, setSenhaErrada] = useState("");
    const [emailErrado, setEmailErrado] = useState("");
    const location = useLocation();
    const title = location.pathname.replace("/", "");

    const atualizaEmail = (e) => {
        setEmailErrado("");
        setEmail(e.target.value);
    }

    const atualizaSenha = (e) => {
        setSenhaErrada("");
        setSenha(e.target.value);
    }

    const concedeAcesso = async () => {
        if (!/@/.test(email)) setEmailErrado("Email inválido.");
        if (email.length <= 2) setEmailErrado("Email muito curto.");
        if (senha.length <= 7) setSenhaErrada("A senha deve ter 8 dígitos.");

        if (emailErrado) return true;
        if (senhaErrada) return true; 

        const nodeURL = process.env.REACT_APP_NODE_URL;
        const url = title == "login"
            ? [nodeURL, "auth", title].join("/")
            : [nodeURL, "usuario"].join("/");

        return await fetch(url, {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                email,
                senha
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            if (response.usuario) {
                setUsuario(response.usuario);
            } else {
                setMensagem(response.message);
                setTimeout(() => setMensagem(false), 30000);
            }
            return true;
        })
        .catch(error => {
            const message = /fetch/.test(error.message)
                ? "Nosso servidor está temporaramente indisponível."
                : error.message;
            setMensagem(message);
            setTimeout(() => setMensagem(false), 30000);
            return true;
        });
    }

    return usuario
        ? <Navigate to="/conteudos" /> 
        : <>
            {mensagem && <Alert style={{ position: "fixed", top: 0, alignSelf: "center" }} variant="filled" severity="error" children={mensagem} />}
            <div className="app-card">
                <h1 children={title} />

                <AppInput
                    placeholder="Email"
                    required
                    errorMessage={emailErrado}
                    handleChange={atualizaEmail}
                    value={email}
                />

                <AppInput 
                    type="password"
                    placeholder="Senha"
                    required
                    errorMessage={senhaErrada}
                    handleChange={atualizaSenha}
                    value={senha}
                />

                {(email && senha) && <AppButton
                    children="Entrar"
                    asyncEvent={concedeAcesso}
                />}
            </div>
        </>
};
