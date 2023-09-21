import { FC } from "react";
import { useNavigate } from "@tanstack/react-location";
import { ROUTES } from "constants/routes";
import { Layout } from "components/layout";


export const Main: FC = () => {
    const navigate = useNavigate();

    const navigateMediaManager = () => {
        navigate({to: ROUTES.media, replace: true})
    }

    return (
        <Layout>
            <button onClick={navigateMediaManager}>MEDIA MANAGER</button>
        </Layout>
    )
}

