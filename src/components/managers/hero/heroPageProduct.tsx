import React, { FC, useState, useEffect } from 'react';
import { common_Product, GetProductsPagedRequest } from 'api/proto-http/admin';
import { getProductsPaged } from 'api/admin';
import { initialFilter } from '../product/componentsOfPageProduct/initialFilterStates';
import { GetProductsPagedResponse } from 'api/proto-http/admin';
import { HeroProducts } from './page/heroProducts';
import styles from 'styles/hero.scss';

interface HeroProductsProps {
  productIds: number[];
  setProductIds: (value: number[]) => void;
}

export const HeroPageProduct: FC<HeroProductsProps> = ({ productIds, setProductIds }) => {
  const [products, setProducts] = useState<common_Product[] | undefined>([]);
  const [showProduct, setShowProducts] = useState(false);
  const [showIdInput, setShowIdInput] = useState(false);
  const [idInput, setIdInput] = useState('');
  const [filter, setFilter] = useState<GetProductsPagedRequest>(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const calculateOffset = (page: number, limit: number) => (page - 1) * limit;

  const handleIdInput = () => {
    const productId = parseInt(idInput, 10);
    if (!isNaN(productId) && !productIds.includes(productId)) {
      setProductIds([...productIds, productId]);
      setIdInput('');
    }
  };

  const handleProductVisibility = () => {
    setShowProducts(!showProduct);
  };

  const handleIdInputVisibility = () => {
    setShowIdInput(!showIdInput);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const newLimit = filter.limit || 6;
      const offset = calculateOffset(currentPage, newLimit);
      const response: GetProductsPagedResponse = await getProductsPaged({
        ...filter,
        limit: newLimit,
        offset,
      });

      setProducts(response.products ? response.products.slice(0, newLimit) : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductClick = (index: number | undefined) => {
    if (index !== undefined && !productIds.includes(index)) {
      setProductIds([...productIds, index]);
    }
  };

  return (
    <div className={styles.list_product_by_ids}>
      <div className={styles.products_container}>
        <div>
          <button type='button' onClick={handleProductVisibility}>
            list products
          </button>
          {showProduct && (
            <div>
              <div>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage <= 1}>
                  1
                </button>
              </div>
              <HeroProducts
                products={products}
                productClick={handleProductClick}
                showHidden={filter.showHidden}
              />
              <div>
                <button onClick={() => setCurrentPage(currentPage + 1)}>2</button>
              </div>
            </div>
          )}
        </div>
        <div>
          <button type='button' onClick={handleIdInputVisibility}>
            add by id
          </button>
          {showIdInput && (
            <div>
              <input
                type='text'
                placeholder='enter id'
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
              />
              <button type='button' onClick={handleIdInput}>
                add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
