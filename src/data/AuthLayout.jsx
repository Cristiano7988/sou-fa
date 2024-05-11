import { CircularProgress } from "@mui/material";
import { useApp } from "./hooks/useApp";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const AuthLayout = () => {
    const { usuario, setUsuario, atualizaMensagem } = useApp();
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!usuario) return navigate("/");
        const nodeURL = process.env.REACT_APP_NODE_URL;
        const url = [nodeURL, "auth", "refresh"].join("/");

        fetch(url, {
            method: "POST",
            body: JSON.stringify(usuario),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(r => r.json())
            .then(response => {
                setUsuario(response.usuario);
                setCarregando(false);
            })
            .catch(error => {
                setUsuario(null);
                const state = { mensagem: error.message ?? "Nosso servidor está temporaramente indisponível." };
                navigate("/", { state });
            });
    }, []);

    return carregando
        ? <CircularProgress />
        : <Outlet />
};
