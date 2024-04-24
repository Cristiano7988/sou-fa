import { useApp } from "../data/hooks/useApp"

export const Perfil = () => {
    const { usuario } = useApp();

    return <div>
        <h1 children="Perfil" />
        
        <p><b>Email:</b> {usuario.email}</p>
    </div>
}
