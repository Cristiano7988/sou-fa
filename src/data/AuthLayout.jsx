import { CircularProgress } from "@mui/material";
import { useApp } from "./hooks/useApp";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const AuthLayout = () => {
    const { usuario, setUsuario } = useApp();
    const [carreando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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
                if (response.usuario) {
                    setUsuario(response.usuario);
                    setCarregando(false);
                } else {
                    setMensagem(response.message);
                    setUsuario(null);
                    navigate("/");
                }
            })
            .catch(error => {
                setMensagem(error.message ?? "Nosso servidor está temporaramente indisponível.");
                setUsuario(null);
                navigate("/")
            });
    }, []);

    return carreando
        ? <CircularProgress />
        : <Outlet />
};
