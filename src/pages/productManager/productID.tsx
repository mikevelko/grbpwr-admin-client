import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProdById } from "api";
import { useLocation } from "react-router-dom";
import { Layout } from "components/layout";
import { common_ProductFull, GetOrderByIdResponse } from "api/proto-http/admin";

export const ProductID: FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [productInfo, setProductInfo] = useState<common_ProductFull | undefined>();

    useEffect(() => {
        const fetchProductInfo = async () => {
            try {
                console.log('Fetching product info...');
                const response = await getProdById({ id: productId as number | undefined });
                console.log('Response:', response);
                setProductInfo(response.product);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (productId) {
            console.log('Product ID:', productId);
            fetchProductInfo();
        }
    }, [productId]);

    console.log('Product Info (outside useEffect):', productInfo);

    return (
        <Layout>
            {productInfo ? (

                <p>{productInfo.product?.productInsert?.name}</p>
            ) : (
                <p>loanding</p>
            )}
        </Layout>
    );
};