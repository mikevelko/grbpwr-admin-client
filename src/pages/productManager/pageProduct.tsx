import React, { FC, useState, useEffect } from "react";
import { Layout } from "components/layout";
import { getProductsPaged } from "api";
import { GetProductsPagedRequest, GetProductsPagedResponse, common_Product} from "api/proto-http/admin";


export const PageProduct: FC = () => {
    const [products, setProducts] = useState<common_Product[] | undefined>(undefined);


    useEffect(() => {
      // Define your request parameters
      const requestParams: GetProductsPagedRequest = {
          limit: 10,
          offset: 0,
          orderFactor: 'ASC',
          sortFactors: undefined,
          filterConditions: undefined,
          showHidden: true
      };
      // Call the Axios request
      getProductsPaged(requestParams)
        .then((data: GetProductsPagedResponse) => {
          // Handle the data returned from the API
          setProducts(data.products);
        })
        .catch((error) => {
          // Handle errors
          console.error('Error fetching products:', error);
        });
    }, []);
    return (
        <Layout>
            <div>
                <ul>
                {products?.map((product) => (
                    <li key={product.id}>{product.id}</li>
                ))}
                </ul>
            </div>
        </Layout>
    );
  };
