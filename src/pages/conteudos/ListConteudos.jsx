import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CreatePayments } from "../payments/CreatePayments";
import { useApp } from "../../data/hooks/useApp";
import { AddCircle } from "@mui/icons-material";

export const ListConteudos = () => {
    const [conteudos, setConteudos] = useState([]);
    const [popUp, setPopUp] = useState(false);
    const { usuario, atualizaMensagem } = useApp();

    const { REACT_APP_NODE_URL } = process.env;
    const url = [REACT_APP_NODE_URL, "conteudos"].join("/");
    const navigate = useNavigate();
    
    if (!usuario) navigate("/");

    const handleMouseEnter = () => setPopUp(true);
    const handleMouseLeave = () => setPopUp(false);
    const handleClick = () => navigate("create");
    
    const queries = "?usuarioId=" + usuario?.id;
    const location = useLocation();
    

    useEffect(() => {
        atualizaMensagem(location.state?.mensagem, location.state?.sucesso);

        fetch(url + queries)
            .then(r => r.json())
            .then(({ conteudos }) => setConteudos(conteudos))
            .catch(console.log)
    }, []);
    
    return <div style={{ display: "flex", flexDirection: "column" }}>

        {conteudos?.map(conteudo => <CreatePayments key={conteudo.id} conteudoInicial={conteudo} />)}
        <div className="add-content" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
            <AddCircle />
            {popUp && <span children="Criar Conteúdo" />}
        </div>
    </div>
}
