import React, { FC, useState, useEffect } from "react";
import { Layout } from "components/layout";
import { getProductsPaged } from "api";
import { GetProductsPagedRequest, GetProductsPagedResponse, common_Product } from "api/proto-http/admin";



export const PageProduct: FC = () => {
  const [products, setProducts] = useState<common_Product[]>([]); // Set initial state to an empty array
  const [page, setPage] = useState<number>(1);
  const numberOfProducts = 1;

  const fetchData = (page: number) => {
      const pagedRequest: GetProductsPagedRequest = {
        limit: numberOfProducts,
        offset: (page - 1) * numberOfProducts,
        sortFactors: undefined,
        orderFactor: "ORDER_FACTOR_ASC",
        filterConditions: undefined,
        showHidden: undefined
      };

      getProductsPaged(pagedRequest)
          .then((data: GetProductsPagedResponse) => {
              setProducts(data.products || []);
          })
          .catch((error) => {
              console.error('error fetching data', error);
          });
  };

  useEffect(() => {
      fetchData(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
      setPage(newPage);
  };

  return (
      <Layout>
          <div>
              {products.length > 0 ? ( // Check if the array is not empty before rendering products
                  products.map((product) => (
                      <div key={product.id}>
                          {/* Display product information here */}
                          <p>{product.productInsert?.name}</p>
                          <img src={product.productInsert?.thumbnail} alt="" style={{ width: '100px', height: '200px' }} />
                      </div>
                  ))
              ) : (
                  <p>No products found</p>
              )}

              <div>
                  <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                      Previous
                  </button>
                  <span> Page {page} </span>
                  <button onClick={() => handlePageChange(page + 1)}>Next</button>
              </div>
          </div>
      </Layout>
  );
};
