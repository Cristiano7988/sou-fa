import { AppProvider } from "./hooks/useApp";
import { Alert, LinearProgress } from "@mui/material";
import { Suspense } from "react";
import { Await, useLoaderData, useOutlet } from "react-router-dom";
import { NavBar } from "../ui/components/NavBar";
import { Container } from "../ui/components/Container";

export const AppLayout = () => {
    const outlet = useOutlet();
    const { userPromise } = useLoaderData();

    return (
        <Suspense fallback={<LinearProgress />}>
            <Await
                resolve={userPromise}
                errorElement={<Alert severity="error">Algo deu errado</Alert>}
                children={
                    usuario => <AppProvider
                        userData={usuario}
                        children={<>
                            <NavBar />
                            <Container children={outlet} />
                        </>}
                    />
                }
            />
        </Suspense>
    );
};
