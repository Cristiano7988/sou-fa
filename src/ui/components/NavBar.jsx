import { useApp } from "../../data/hooks/useApp";
import { AccountCircle, ArrowDropDown } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { AppButton } from "./AppButton";
import { useRef, useState } from "react";

export const NavBar = () => {
    const [menu, setMenu] = useState(false);
    const menuContainerRef = useRef(null);
    const location = useLocation();
    const { logout, usuario } = useApp();

    const appName = process.env.REACT_APP_NAME ?? "Nome do App";
    const cadastro = location.pathname == "/cadastro";
 
    const handleToggleMenu = () => {
        if (usuario) setMenu(!menu);
    }
    const handleMouseLeave = () => setMenu(false);
    const handleClick = (e) => setMenu(e.target !== menuContainerRef.current);
    
    const toggleMenu = event => event.target.closest(".app-pop-up-menu-trigger").classList.toggle("aberto");
    const handleLeaving = event => event.target.closest(".aberto")?.classList.remove("aberto");
    const handleLogout = async () => await logout();
    
    return <div className="app-bar">
        <div className="app-toolbar">
            <div className={["app-nav-links", usuario ? "trigger" : ""].join(" ")}>
                <span onClick={handleToggleMenu} children={<><b>{appName}</b>{usuario && <ArrowDropDown className={menu ? "aberto" : ""} />}</>} />
                {<div ref={menuContainerRef} className={["app-menu-container", menu ? "aberto" : ""].join(" ")} onClick={handleClick}>
                    <div className={["app-menu", menu ? "aberto" : ""].join(" ")} onMouseLeave={handleMouseLeave}>
                        <NavLink state={false} to="/conteudos"  children="Destaques"/>
                        <hr />
                        <NavLink state={{ filter: { mine: true } }} to="/conteudos"  children="Meus conteúdos"/>
                    </div>
                </div>}
            </div>
            {!usuario && <div className="app-nav-links">
                {cadastro && <NavLink to="/" children="Login" />}
                {!cadastro && <NavLink to="/cadastro" children="Cadastrar" />}
            </div>}
            {usuario && <div className="app-pop-up-menu-trigger" onMouseLeave={handleLeaving}>
                <AccountCircle onClick={toggleMenu} />
                <div className="app-pop-up-menu">
                    <NavLink to="/perfil" children="Perfil"/>
                    <AppButton asyncEvent={handleLogout} children="Log out"/>
                </div>
            </div>}
        </div>
    </div>
}
