import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert } from "@mui/material";

export const AppContext = createContext();

export const AppProvider = ({ children, userData }) => {
    const [usuario, setUsuario] = useLocalStorage("usuario", userData);
    const [mensagem, setMensagem] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!mensagem) return;

        setTimeout(() => setMensagem(""), 2000)
    }, [mensagem]);

    const atualizaMensagem = (novaMensagem, sucesso = false) => {
        setMensagem(novaMensagem);
        setSucesso(sucesso);
    }

    const logout = async () => {
        const nodeURL = process.env.REACT_APP_NODE_URL;
        const url = [nodeURL, "auth", "logout"].join("/");

        return await fetch(url, {
            method: "POST",
            body: JSON.stringify(usuario),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(response => {
            setUsuario(null);
            const state = { mensagem: response.message, sucesso: true };
            navigate("/", { state });
            return true;
        })
        .catch((response) => {
            const state = { mensagem: response.message };
            setUsuario(null);
            navigate("/", { state });
            return true;
        })
    };

    const value = useMemo(
        () => ({
            usuario,
            setUsuario,
            mensagem,
            atualizaMensagem,
            logout,
        }),
        [usuario]
    );

    return <AppContext.Provider value={value}>
        {children}
        {mensagem && <Alert
            className={["mensagem", sucesso ? "sucesso" : "erro"].join(" ")}
            variant="filled"
            severity={sucesso ? "success" : "error"}
            children={mensagem}
            onClose={() => atualizaMensagem("")}
        />}
    </AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
