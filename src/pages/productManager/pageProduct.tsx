import React, { FC, useState, useEffect } from 'react';
import { Layout } from 'components/layout';
import { common_Product } from 'api/proto-http/admin';
import { getProductsPaged, deleteProductByID } from 'api/admin';
import { useNavigate } from '@tanstack/react-location';
import { GetProductsPagedResponse } from 'api/proto-http/admin';
import { ROUTES } from 'constants/routes';
import styles from 'styles/paged.scss';

export const PageProduct: FC = () => {
  const [products, setProducts] = useState<common_Product[] | undefined>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: why alert 2 times ?
        const response: GetProductsPagedResponse = await getProductsPaged({
          limit: 10,
          offset: 1,
          sortFactors: undefined,
          orderFactor: 'ORDER_FACTOR_ASC',
          filterConditions: undefined,
          showHidden: false,
        });

        setProducts(response.products || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleProductClick = (index: number | undefined) => {
    setSelectedProductIndex(index);
    // Navigate to another page with the selected index
    navigate({ to: `${ROUTES.singleProduct}?productId=${index}`, replace: true });
  };

  const handleDeleteClick = async (productId: number | undefined) => {
    try {
      await deleteProductByID({ id: productId });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Layout>
      <div className={styles.product_container}>
        <ul className={styles.product_list}>
          {products?.map((product) => (
            <li key={product.id} onClick={() => handleProductClick(product.id)}>
              <button onClick={() => handleDeleteClick(product.id)}>X</button>
              <img src={product.productInsert?.thumbnail} alt='img' />
              <h5>{product.productInsert?.name}</h5>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};
