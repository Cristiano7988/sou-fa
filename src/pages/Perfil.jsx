import { useApp } from "../data/hooks/useApp"

export const Perfil = () => {
    const { usuario } = useApp();

    return <div className="app-card-container">
        <h1 children="Perfil" />
        
        <p><b>Email:</b> {usuario.email}</p>
    </div>
}
