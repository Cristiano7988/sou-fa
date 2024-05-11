import { useApp } from "../../data/hooks/useApp";
import { AccountCircle } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { AppButton } from "./AppButton";

export const NavBar = () => {
    const location = useLocation();
    const { logout, usuario } = useApp();

    const appName = process.env.REACT_APP_NAME ?? "Nome do App";
    const cadastro = location.pathname == "/cadastro";
 
    const handleLeaving = event => event.target.closest(".show")?.classList.remove("show");
    const toggleMenu = event => event.target.closest(".app-pop-up-menu-trigger").classList.toggle("show");
    const handleClick = async () => await logout();

    return <div className="app-bar">
        <div className="app-toolbar">
            <div className="app-nav-links">
                <div>
                    <NavLink to="/conteudos" state={false} children={<b>{appName}</b>} />
                </div>
                {!usuario && <div>
                    {cadastro && <NavLink to="/" children="Login" />}
                    {!cadastro && <NavLink to="/cadastro" children="Cadastrar" />}
                </div>}
            </div>
            {usuario && <div className="app-pop-up-menu-trigger" onMouseLeave={handleLeaving}>
                <AccountCircle onClick={toggleMenu} />
                <div className="app-pop-up-menu">
                    <NavLink to="/perfil" children="Perfil"/>
                    <AppButton asyncEvent={handleClick} children="Log out"/>
                </div>
            </div>}
        </div>
    </div>
}
