import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
    const navigate = useNavigate();
    const handleClick = () => navigate("/");

    return <div>
        <div>
            <h1 children="Página não encontrada" />
            <p children="Infelizmente, não localizamos essa página." />
            <button
                children="Página inicial"
                onClick={handleClick}
            />
        </div>
    </div>
};