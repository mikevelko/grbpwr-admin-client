import { FC } from "react";
import { useNavigate } from "@tanstack/react-location";
import { ROUTES } from "constants/routes";
import { Layout } from "components/layout";



export const Product: FC = () => {
    const navigate = useNavigate();

    const navigateAddProduct = () => {
        navigate({ to: ROUTES.addProduct, replace: true });
    }

    return (
        <Layout>
            <button>LIST PRODUCTS</button>
            <button onClick={navigateAddProduct}>ADD PRODUCT</button>
        </Layout>
    )
}