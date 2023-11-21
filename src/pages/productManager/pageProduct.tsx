import React, { FC, useState, useEffect } from "react";
import { Layout } from "components/layout";
import { common_Product } from "api/proto-http/admin";
import { getProductsPaged } from "api";
import { GetProductsPagedResponse } from "api/proto-http/admin";



const PAGE_SIZE = 3; // Number of products per page

export const PageProduct: FC = () => {
  const [products, setProducts] = useState<common_Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products for the current page
        const response: GetProductsPagedResponse = await getProductsPaged({
          limit: PAGE_SIZE,
          offset: (currentPage - 1) * PAGE_SIZE,
          sortFactors: undefined,
          orderFactor: 'ORDER_FACTOR_ASC',
          filterConditions: undefined,
          showHidden: true,
        });

        // Update the products state
        setProducts((prevProducts) =>
          currentPage === 1
            ? response.products?.slice(0, PAGE_SIZE) || []
            : [...prevProducts, ...(response.products || [])]
        );

      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    setProducts([])

    fetchData(); // Fetch data when the component mounts or currentPage changes
  }, [currentPage]);


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Layout>
      {/* Display your products here */}
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.productInsert?.name}</li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span> Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </Layout>
  );
};
