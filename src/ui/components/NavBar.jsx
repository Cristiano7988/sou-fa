import { useApp } from "../../data/hooks/useApp";
import { AccountCircle } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";

export const NavBar = () => {
    const location = useLocation();
    const { logout, usuario } = useApp();

    const appName = process.env.REACT_APP_NAME ?? "Nome do App";
    const login = location.pathname != "/login";
    const cadastro = location.pathname != "/cadastro";
 
    const handleLeaving = event => event.target.closest(".show")?.classList.remove("show");
    const toggleMenu = event => event.target.closest(".app-pop-up-menu-trigger").classList.toggle("show");
    const handleClick = () => logout();

    return <div className="app-bar">
        <div className="app-toolbar">
            <div className="app-nav-links">
                <div>
                    <NavLink to="/" children={<b>{appName}</b>} />
                    {usuario && <NavLink to="/conteudos" children="Conteúdos" />}
                </div>
                {!usuario && <div>
                    {login && <NavLink to="/login" children="Login" />}
                    {cadastro && <NavLink to="/cadastro" children="Cadastrar" />}
                </div>}
            </div>
            {usuario && <div className="app-pop-up-menu-trigger" onMouseLeave={handleLeaving}>
                <AccountCircle onClick={toggleMenu} />
                <div className="app-pop-up-menu">
                    <NavLink to="/perfil" children="Perfil"/>
                    <NavLink onClick={handleClick} children="Log out"/>
                </div>
            </div>}
        </div>
    </div>
}
