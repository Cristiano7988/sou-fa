import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CreatePayments } from "../payments/CreatePayments";
import { useApp } from "../../data/hooks/useApp";
import { AddCircle } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

export const ListConteudos = () => {
    const [carregando, setCarregando] = useState(true);
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
    const location = useLocation();
    let { filter = false } = location?.state ?? {};

    if (filter) {
        [filter] = Object.entries(filter);
        filter = filter.join("=")
    }

    const queries = "?" + ["usuarioId=" + usuario?.id, filter].join("&");
    

    useEffect(() => {
        setCarregando(true);
        atualizaMensagem(location.state?.mensagem, location.state?.sucesso);

        fetch(url + queries)
            .then(r => r.json())
            .then(({ conteudos }) => {
                setConteudos(conteudos);
                setCarregando(false);
            })
            .catch(e => {
                console.log(e);
                setCarregando(false);
            })
    }, [location]);
    
    return <>
        {carregando
            ? <CircularProgress />
            : <>
                {conteudos.length
                    ? conteudos.map(conteudo => <CreatePayments key={conteudo.id} conteudoInicial={conteudo} />)
                    : <p className="secondary-text" children="Não encontramos resultados para esta busca" />}
            </>}

        <div className="add-content" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
            <AddCircle />
            {popUp && <span children="Criar Conteúdo" />}
        </div>
    </>
}
