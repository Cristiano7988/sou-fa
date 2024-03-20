import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppProvider = ({ children, userData }) => {
    const [usuario, setUsuario] = useLocalStorage("usuario", userData);
    const navigate = useNavigate();

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
            if (response.usuario) {
                setUsuario(null);
                navigate("/");
            }
            return true;
        })
        .catch(() => {
            setUsuario(null);
            navigate("/");
            return true;
        })
    };

    const value = useMemo(
        () => ({
            usuario,
            setUsuario,
            logout,
        }),
        [usuario]
    );

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
