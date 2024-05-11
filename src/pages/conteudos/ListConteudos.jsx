import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { CreatePayments } from "../payments/CreatePayments";
import { useApp } from "../../data/hooks/useApp";

export const ListConteudos = () => {
    const [conteudos, setConteudos] = useState([]);
    const { usuario, atualizaMensagem } = useApp();

    const { REACT_APP_NODE_URL } = process.env;
    const url = [REACT_APP_NODE_URL, "conteudos"].join("/");
    const navigate = useNavigate();
    const queries = "?usuarioId=" + usuario.id;
    const location = useLocation();
    
    if (!usuario) navigate("/")

    useEffect(() => {
        atualizaMensagem(location.state?.mensagem, location.state?.sucesso);

        fetch(url + queries)
            .then(r => r.json())
            .then(({ conteudos }) => setConteudos(conteudos))
            .catch(console.log)
    }, []);
    
    return <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to="create" children="Criar conteúdo" style={{ alignSelf: "end" }} />

        {conteudos.map(conteudo => <CreatePayments key={conteudo.id} conteudoInicial={conteudo} />)}
    </div>
}
