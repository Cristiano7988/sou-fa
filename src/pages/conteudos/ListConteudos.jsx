import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CreatePayments } from "../payments/CreatePayments";
import { useApp } from "../../data/hooks/useApp";
import { AddCircle } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

export const ListConteudos = () => {
    const [carregando, setCarregando] = useState(true);
    const [conteudos, setConteudos] = useState([]);
    const location = useLocation();
    const [offset, setOffset] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const [filter, setFilter] = useState(location?.state?.filter);
    const [popUp, setPopUp] = useState(false);
    const { usuario, atualizaMensagem } = useApp();

    window.onscroll = () => {
        const tamanhoDaTela = window.document.body.offsetHeight - window.innerHeight;
        const finalDaPagina = window.scrollY == tamanhoDaTela;
        const jaRolouAteOFim = window.scrollY != scrollY;

        if (window.scrollY && finalDaPagina && jaRolouAteOFim && !carregando) {
            setOffset(offset + 1);
            setScrollY(window.scrollY);
        }
    }

    const { REACT_APP_NODE_URL } = process.env;
    const url = [REACT_APP_NODE_URL, "conteudos"].join("/");
    const navigate = useNavigate();
    
    if (!usuario) navigate("/");

    const handleMouseEnter = () => setPopUp(true);
    const handleMouseLeave = () => setPopUp(false);
    const handleClick = () => navigate("create");

    let queries = ["usuarioId=" + usuario?.id];

    const atualizaConteudos = (offset) => {
        setCarregando(true);
        
        const newFilter = location?.state?.filter
        if (newFilter) queries.push("filter=" + newFilter);

        queries.push("offset=" + (offset));
        fetch(url + "?" + queries.join("&"))
            .then(r => r.json())
            .then((response) => {

                const novosConteudos = response.conteudos
                if (location?.state?.filter == filter) novosConteudos.unshift(...conteudos);
                setConteudos(novosConteudos);

                setCarregando(false);
            })
            .catch(e => {
                console.log(e);
                setConteudos([]);
                setCarregando(false);
            })
    }
    
    useEffect(() => {
        atualizaMensagem(location.state?.mensagem, location.state?.sucesso);
        
        setFilter(location?.state?.filter);
        setConteudos([]);
        setOffset(0);
        
        atualizaConteudos(0);
    }, [location?.state?.filter]);


    useEffect(() => {
        if (!offset) return;

        atualizaConteudos(offset);
    }, [offset]);

    
    return <>
        {carregando && <CircularProgress sx={{ position: "fixed", top: "50%", zIndex: 1  }} />}
        {conteudos?.map(conteudo => <CreatePayments key={conteudo.id} conteudoInicial={conteudo} />)}
        {!conteudos.length && !carregando && <p className="secondary-text" children="Não encontramos resultados para esta busca" />}

        <div className="add-content" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
            <AddCircle />
            {popUp && <span children="Criar Conteúdo" />}
        </div>
    </>
}
