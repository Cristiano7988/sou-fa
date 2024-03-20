import { CircularProgress } from "@mui/material";
import { useState } from "react";

export const AppButton = ({ children, asyncEvent }) => {
    const [carregando, setCarregando] = useState(false);

    const handleClick = () => {
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
            className="app-button"
            type="button"
            children={children}
            onClick={handleClick}
        />
}