import React, { FC, useState, useEffect } from 'react';
import { common_Product, GetProductsPagedRequest } from 'api/proto-http/admin';
import { getProductsPaged } from 'api/admin';
import { initialFilter } from '../product/componentsOfPageProduct/initialFilterStates';
import { GetProductsPagedResponse } from 'api/proto-http/admin';
import { HeroProducts } from './page/heroProducts';
import styles from 'styles/hero.scss';

interface HeroProductsProps {
  //   addNewHero: () => void;
  productIds: number[];
  setProductIds: (value: number[]) => void;
}

export const HeroPageProduct: FC<HeroProductsProps> = ({
  //   addNewHero,
  productIds,
  setProductIds,
}) => {
  const [products, setProducts] = useState<common_Product[] | undefined>([]);
  const [filter, setFilter] = useState<GetProductsPagedRequest>(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const calculateOffset = (page: number, limit: number) => (page - 1) * limit;

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
    <div className={styles.page}>
      <div className={styles.products_carousel}>
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

      {/* <button type='button' onClick={addNewHero} disabled={productIds.length === 0}>
        add ids
      </button> */}
    </div>
  );
};
