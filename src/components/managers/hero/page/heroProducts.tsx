import React, { FC, useState } from 'react';
import { common_Product } from 'api/proto-http/admin';
import styles from 'styles/hero.scss';

interface ProductProps {
  products: common_Product[] | undefined;
  productClick: (productId: number | undefined) => void;
  showHidden: boolean | undefined;
}

export const HeroProducts: FC<ProductProps> = ({ products, productClick, showHidden }) => {
  const [hoveredProductId, setHoveredProductId] = useState<number | undefined>(undefined);

  return (
    <ul className={styles.product_list}>
      {products?.map((product) => (
        <li
          key={product.id}
          onMouseEnter={() => setHoveredProductId(product.id)}
          onMouseLeave={() => setHoveredProductId(undefined)}
          onClick={() => productClick(product.id)}
          className={`${product.productInsert?.hidden && showHidden ? styles.hidden_product : ''}`}
        >
          <img src={product.productInsert?.thumbnail} alt='Product Image' />
          <h5>
            {product.productInsert?.name} - {product.id}
          </h5>
        </li>
      ))}
    </ul>
  );
};
