import React, { FC, useState, useEffect } from "react";
import { Layout } from "components/layout";
import { common_ProductFull } from "api/proto-http/admin";
import { getProductByID } from "api";
import { AddMediaByID } from "./productManagerComponents/addMediaById";
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
        <div className={styles.product_id_full_content}>
          <div className={styles.img_grid}>
            <div className={styles.main_img_container}>
              <img src={product?.product?.productInsert?.thumbnail} alt="thumbnail" className={styles.main_img} />
            </div>
            <ul className={styles.product_by_id_media_list}>
              {product?.media?.map((media, index)=> (
                <li key={index}>
                  <img src={media.productMediaInsert?.compressed} alt="" />
                </li>
              ))}
            </ul>
            <AddMediaByID />
          </div>
          <div className={styles.product_id_information}>
            <h3>{product?.product?.productInsert?.brand}</h3>
            <ul>
              {product?.sizes?.map((size, index) => (
                <li key={index}>{size.id}</li>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    );
  };