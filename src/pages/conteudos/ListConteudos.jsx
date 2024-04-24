import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CreatePayments } from "../payments/CreatePayments";
import { useApp } from "../../data/hooks/useApp";

export const ListConteudos = () => {
    const { REACT_APP_NODE_URL } = process.env;
    const { usuario } = useApp();
    const queries = "?usuarioId=" + usuario.id;
    const url = [REACT_APP_NODE_URL, "conteudos"].join("/");

    const [conteudos, setConteudos] = useState([]);

    useEffect(() => {
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
