import { CircularProgress } from "@mui/material";
import { useState } from "react";

export const AppButton = ({ children, asyncEvent = false, type = "button", id = "" }) => {
    const [carregando, setCarregando] = useState(false);

    const handleClick = () => {
        if (!asyncEvent) return;
 
        setCarregando(true);

        asyncEvent()
            .then((response) => {
                if (response) setCarregando(false);
            })
            .catch(() => {
                setCarregando(false);
            });
    }
    
    return carregando
        ? <CircularProgress size={30} style={{ alignSelf: "center" }} />
        : <button
            id={id}
            className="app-button"
            type={type}
            children={children}
            onClick={handleClick}
        />
}