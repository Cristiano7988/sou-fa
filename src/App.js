import { Route, createBrowserRouter, createRoutesFromElements, defer } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route exact path="/" element={"Espera"} />
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);
