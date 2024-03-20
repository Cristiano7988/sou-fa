import { useLocation } from "react-router-dom"

export const Page = () => {
    const location = useLocation();
    const title = location.pathname.replace("/", "");

    return <div children={<h1 children={title ? title : "Home"} />} />
}
