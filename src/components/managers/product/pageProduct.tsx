import React, { FC, useState, useEffect } from 'react';
import { Layout } from 'components/layout/layout';
import {
  common_OrderFactor,
  common_Product,
  common_SortFactor,
  GetProductsPagedRequest,
} from 'api/proto-http/admin';
import { getProductsPaged, deleteProductByID } from 'api/admin';
import { useNavigate } from '@tanstack/react-location';
import { GetProductsPagedResponse } from 'api/proto-http/admin';
import { ROUTES } from 'constants/routes';
import styles from 'styles/paged.scss';

export const PageProduct: FC = () => {
  const [products, setProducts] = useState<common_Product[] | undefined>([]);
  const [filter, setFilter] = useState<GetProductsPagedRequest>({
    limit: 10,
    offset: 0,
    sortFactors: undefined,
    orderFactor: undefined,
    filterConditions: {
      from: undefined,
      to: undefined,
      onSale: undefined,
      color: undefined,
      categoryId: undefined,
      sizesIds: undefined,
      preorder: undefined,
      byTag: undefined,
    },
    showHidden: undefined,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: GetProductsPagedResponse = await getProductsPaged({
          ...filter,
        });

        setProducts(response.products || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    // return () => {};
  }, [filter]);

  const handleProductClick = (index: number | undefined) => {
    navigate({ to: `${ROUTES.singleProduct}?productId=${index}`, replace: true });
  };

  const handleDeleteClick = async (productId: number | undefined) => {
    try {
      await deleteProductByID({ id: productId });
      setProducts((prevProducts) =>
        prevProducts ? prevProducts.filter((product) => product.id !== productId) : prevProducts,
      );
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleFilterChange = <K extends keyof GetProductsPagedRequest>(
    key: K,
    value: GetProductsPagedRequest[K],
  ) => {
    setFilter((prevFilter) => ({ ...prevFilter, [key]: value }));
  };

  return (
    <Layout>
      <>
        <select
          value={filter.sortFactors}
          onChange={(e) => handleFilterChange('sortFactors', [e.target.value as common_SortFactor])}
        >
          <option value='SORT_FACTOR_CREATED_AT'>cr at</option>
          <option value='SORT_FACTOR_UPDATED_AT'> up at</option>
          <option value='SORT_FACTOR_NAME'>n</option>
          <option value='SORT_FACTOR_PRICE'>p</option>
        </select>
        <select
          name='orderFactor'
          value={filter.orderFactor}
          onChange={(e) => handleFilterChange('orderFactor', e.target.value as common_OrderFactor)}
        >
          <option value='ORDER_FACTOR_ASC'>asc</option>
          <option value='ORDER_FACTOR_DESC'>desc</option>
        </select>
      </>
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
