import { FC, useState } from "react";
import { useNavigate } from "@tanstack/react-location";
import { ROUTES } from "constants/routes";
import { Layout } from "components/layout";
import { common_Product } from "api/proto-http/admin";


export const Product: FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<common_Product[]>([]);

    const navigateAddProduct = () => {
        navigate({ to: ROUTES.addProduct, replace: true });
    }

    const navigatePageProduct = async () => {
        navigate({ to: ROUTES.pagedProduct, replace: true });
    }

    return (
        <Layout>
            <button onClick={navigatePageProduct}>LIST PRODUCTS</button>
            <button onClick={navigateAddProduct}>ADD PRODUCT</button>
        </Layout>
    )
}