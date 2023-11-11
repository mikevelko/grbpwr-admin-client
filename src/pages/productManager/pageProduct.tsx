import React, { FC, useState, useEffect } from "react";
import { Layout } from "components/layout";
import { getProductsPaged, getProdById} from "api";
import { GetProductsPagedRequest, GetProductsPagedResponse, common_Product, common_ProductFull, GetProductByIDRequest} from "api/proto-http/admin";


export const PageProduct: FC = () => {
    const [products, setProducts] = useState<common_Product[] | undefined>(undefined);
    const [selectedProduct, setSelectedProduct] = useState<common_ProductFull | null>(null);


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

    const handleProductClick = (productId: number | undefined) => {
      if (productId !== undefined) {
        const requestParams: GetProductByIDRequest = {
          id: productId,
        };
        // Call the Axios request to get the details of the clicked product
        getProdById(requestParams)
          .then((data) => {
            // Handle the data returned from the API
            setSelectedProduct(data.product);
          })
          .catch((error) => {
            // Handle errors
            console.error('Error fetching product details:', error);
          });
      } else {
        console.log('id is undefined');
      }
    };


    return (
        <Layout>
            <div>
                <ul>
                {products?.map((product) => (
                    <li key={product.id} onClick={() => handleProductClick(product.id)}>
                      <img src={product.productInsert?.thumbnail} alt="img" style={{width: '100px', height: '100px'}}/>
                    </li>
                ))}
                </ul>
                {selectedProduct && (
                  <div>
                    <h2>{selectedProduct.product?.productInsert?.name}</h2>
                  </div>
                )}
            </div>
        </Layout>
    );
  };
