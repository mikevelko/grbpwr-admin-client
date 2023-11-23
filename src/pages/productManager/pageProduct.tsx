import React, { FC, useState, useEffect } from "react";
import { Layout } from "components/layout";
import { common_Product } from "api/proto-http/admin";
import { getProductsPaged, getProdById} from "api";
import { useNavigate } from "@tanstack/react-location";
import { GetProductsPagedResponse, } from "api/proto-http/admin";
import { ROUTES } from "constants/routes";



const PAGE_SIZE = 3; // Number of products per page

export const PageProduct: FC = () => {
  const [products, setProducts] = useState<common_Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: GetProductsPagedResponse = await getProductsPaged({
          limit: PAGE_SIZE,
          offset: (currentPage - 1) * PAGE_SIZE,
          sortFactors: undefined,
          orderFactor: 'ORDER_FACTOR_ASC',
          filterConditions: undefined,
          showHidden: true,
        });
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

    fetchData();
  }, [currentPage]);


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleProductId = async (productId: number | undefined) => {
    try {
        const response = await getProdById({ id: productId });
        const queryParams = new URLSearchParams();
        navigate({
          to: `${ROUTES.singleProduct}/${productId}?${queryParams.toString()}`,
          replace: true,
        });
      } catch (error) {
      console.error('Error fetching product details:', error);
    }
  }  

  return (
    <Layout>
      <ul>
        {products.map((product) => (
          <li key={product.id} onClick={() => handleProductId(product.id)}>
            <img src={product.productInsert?.thumbnail} alt="img" style={{width: '100px', height: '100px'}} />
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
    </Layout>
  );
}
