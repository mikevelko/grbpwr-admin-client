import React, { FC, useState, useEffect } from 'react';
import { Layout } from 'components/layout';
import { common_OrderFactor, common_Product, common_SortFactor } from 'api/proto-http/admin';
import { getProductsPaged, deleteProductByID } from 'api/admin';
import { useNavigate } from '@tanstack/react-location';
import { GetProductsPagedResponse } from 'api/proto-http/admin';
import { ROUTES } from 'constants/routes';
import styles from 'styles/paged.scss';

const PAGE_SIZE = 3; // Number of products per page

// TODO: remove nepravilno blyat'
const sortFactorOptions: common_SortFactor[] = [
  'SORT_FACTOR_UNKNOWN',
  'SORT_FACTOR_CREATED_AT',
  'SORT_FACTOR_UPDATED_AT',
  'SORT_FACTOR_NAME',
  'SORT_FACTOR_PRICE',
];

const orderFactorOptions: common_OrderFactor[] = ['ORDER_FACTOR_ASC', 'ORDER_FACTOR_DESC'];

export const PageProduct: FC = () => {
  const [products, setProducts] = useState<common_Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(PAGE_SIZE);
  const [offset, setOffset] = useState<number>(0);
  // const [sortFactors, setSortFactors] = useState<common_SortFactor[] | undefined>(sortFactorOptions);
  const [orderFactor, setOrderFactor] = useState<common_OrderFactor | undefined>(undefined);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response: GetProductsPagedResponse = await getProductsPaged({
        limit,
        offset,
        sortFactors: undefined,
        orderFactor: orderFactor,
        filterConditions: undefined,
        showHidden: true,
      });

      setProducts((prevProducts) =>
        currentPage === 1
          ? response.products?.slice(0, limit) || []
          : [...prevProducts, ...(response.products || [])],
      );
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    setProducts([]);
    fetchData();
  }, [currentPage, orderFactor]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
        <div>
          <label htmlFor=''>
            order
            <select
              value={orderFactor || ''}
              onChange={(e) => setOrderFactor(e.target.value as common_OrderFactor)}
            >
              {orderFactorOptions.map((order, index) => (
                <option key={index} value={order}>
                  {order}
                </option>
              ))}
            </select>
          </label>
          <button onClick={() => fetchData()}>Apply</button>
        </div>
        <ul className={styles.product_list}>
          {products.map((product) => (
            <li key={product.id} onClick={() => handleProductClick(product.id)}>
              <button onClick={() => handleDeleteClick(product.id)}>X</button>
              <img src={product.productInsert?.thumbnail} alt='img' />
              <h5>{product.productInsert?.name}</h5>
            </li>
          ))}
        </ul>
        <div>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>{currentPage}</span>
          <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        </div>
      </div>
    </Layout>
  );
};
