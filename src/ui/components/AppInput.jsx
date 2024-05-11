import { useState } from "react"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { valida } from "../../data/helpers/valida";
import { transforma } from "../../data/helpers/transforma";

export const AppInput = ({ type = "text", placeholder, updateData = false, required = false, className = "", id = "" }) => {
    const [value, setValue] = useState("");
    const item = transforma.emCamelCase(placeholder);

    const [errorMessage, setErrorMessage] = useState("");
    const [focus, setFocus] = useState(!!value);
    const [showPassword, setShowPassword] = useState(false);

    const validaCampo = async (value) => {
        const erros = await valida.regras({ [item]: value });

        if (erros.length) setErrorMessage(transforma.arrayEmTexto(erros))
        else setErrorMessage("");

        return erros.length;
    }

    const handleChange = async (e) => {
        const { value, files = [] } = e.target;
        const data = type == "file" ? files[0] : value;

        setValue(value);

        if (!updateData) return;

        const invalido = await validaCampo(data)
        updateData({ 
            [item]: data,
            [item + "Invalido"]: invalido
        });
    }


    const handleFocus = (e) => {
        if (e.target.closest(".app-password-visibility")) return;
        e.target.closest(".app-input-container")?.querySelector("input").focus()
        setFocus(true);
    }

    const handleBlur = (e) => {
        if (value) return;
        setFocus(false);
    }

    const togglePassword = () => setShowPassword(!showPassword);
    const step = type == "number" && { step: 0.01, min: 0, max: 999 };

    return <div
        className={[
            "app-input-container",
            className,
            focus ? "focused" : "",
            errorMessage ? "error" : ""
        ].join(" ")}
        onBlur={handleBlur}
        onClick={handleFocus}
        onFocus={handleFocus}
    >
        {placeholder && <label children={[placeholder, required ? "*" : ""].join(" ")} />}

        <div className="app-input">
            <input id={id ? id : item} type={showPassword ? "text" : type} value={value} onChange={handleChange} {...step} />
            {errorMessage && <span dangerouslySetInnerHTML={{ __html: errorMessage }} />}
        </div>

        {placeholder == "Senha" && <div className="app-password-visibility" onClick={togglePassword}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
        </div>}
    </div>
}