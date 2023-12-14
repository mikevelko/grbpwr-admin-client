import React, { FC, useState, useEffect } from 'react';
import { Layout } from 'components/layout/layout';
import {
  common_Product,
  common_FilterConditions,
  GetProductsPagedRequest,
} from 'api/proto-http/admin';
import { getProductsPaged, deleteProductByID } from 'api/admin';
import { initialFilter } from './componentsOfPageProduct/initialFilterStates';
import { useNavigate } from '@tanstack/react-location';
import { GetProductsPagedResponse } from 'api/proto-http/admin';
import { Filter } from './componentsOfPageProduct/filterProducts';
import { ROUTES } from 'constants/routes';
import styles from 'styles/paged.scss';

export const PageProduct: FC = () => {
  const [products, setProducts] = useState<common_Product[] | undefined>([]);
  const [filter, setFilter] = useState<GetProductsPagedRequest>(initialFilter);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    // TODO: clean up logic ???
  }, []);

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

  const handleProductClick = (index: number | undefined) => {
    navigate({ to: `${ROUTES.singleProduct}?productId=${index}`, replace: true });
  };

  const handleDeleteClick = async (productId: number | undefined) => {
    try {
      await deleteProductByID({ id: productId });
      setProducts((prevProducts) => prevProducts?.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleFilterChange = <
    K extends keyof GetProductsPagedRequest | keyof common_FilterConditions,
  >(
    key: K,
    value: K extends keyof GetProductsPagedRequest
      ? GetProductsPagedRequest[K]
      : K extends keyof common_FilterConditions
      ? common_FilterConditions[K]
      : never,
  ) => {
    setFilter((prevFilter) => {
      return {
        ...prevFilter,
        ...(key in prevFilter
          ? { [key]: value }
          : {
              filterConditions: {
                ...(prevFilter.filterConditions || {}),
                [key]: value,
              },
            }),
      } as GetProductsPagedRequest;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
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
      <Filter filter={filter} filterChange={handleFilterChange} onSubmit={handleSubmit} />
    </Layout>
  );
};
