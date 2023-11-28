import React, { FC, useState, useEffect } from "react";
import { Layout } from "components/layout";
import { common_ProductFull } from "api/proto-http/admin";
import { getProductByID } from "api";
import queryString from "query-string";
import styles from 'styles/productID.scss'

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
        <div className={styles.img_grid}>
          <div className={styles.main_img}>
            <img src={product?.product?.productInsert?.thumbnail} alt="thumbnail" />
          </div>
          <ul>
            {product?.media?.map((media, index)=> (
              <li key={index}>
                <img src={media.productMediaInsert?.compressed} alt="" />
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    );
  };