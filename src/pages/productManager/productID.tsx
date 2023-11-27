import React, { FC, useState, useEffect } from "react";
import { Layout } from "components/layout";
import { common_ProductFull, GetProductByIDRequest } from "api/proto-http/admin";
import { getProductByID } from "api";
import queryString from "query-string";

export const ProductID: FC = () => {
  const queryParams = queryString.parse(window.location.search);
    const productId = queryParams.productId as string;
    const [product, setProuct] = useState<common_ProductFull | undefined>(undefined)
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getProductByID({ id: Number(productId) });
          setProuct(response.product)
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      };
  
      fetchData();
    }, [productId]);

    console.log('Product:', product);
  
    return (
      <Layout>
        <p>{product?.product?.productInsert?.color}</p>
        <p>{product?.product?.productInsert?.color}</p>
        <p>{product?.product?.createdAt}</p>
        <img src={product?.product?.productInsert?.thumbnail} alt="thumb"  style={{width: '100px', height: '100px'}}/>
        <p></p>
        <p></p>
      </Layout>
    );
  };