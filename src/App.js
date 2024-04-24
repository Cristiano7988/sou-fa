import { Route, createBrowserRouter, createRoutesFromElements, defer } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
import { Auth } from "./pages/Auth";
import { AuthLayout } from "./data/AuthLayout";
import { AppLayout } from "./data/AppLayout";
import { Page } from "./pages/Page";
import { CreateConteudos } from "./pages/conteudos/CreateConteudos";
import { ListConteudos } from "./pages/conteudos/ListConteudos";
import { Perfil } from "./pages/Perfil";

const getUserData = () =>
    new Promise((resolve) => {
        const usuario = window.localStorage.getItem("usuario");
        resolve(usuario);
    });

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            element={<AppLayout />}
            loader={() => defer({ usuarioPromise: getUserData() })}
        >
            <Route exact path="/" element={<Page />} />
            <Route exact path="/cadastro" element={<Auth />} />
            <Route exact path="/login" element={<Auth />} />
                <Route element={<AuthLayout />}>
                    <Route path="/conteudos" element={<ListConteudos />} />
                    <Route path="/conteudos/create" element={<CreateConteudos />} />
                    <Route path="/perfil" element={<Perfil />} />
                    <Route path="*" element={<ErrorPage />} />
                </Route>
        </Route>
    )
);
