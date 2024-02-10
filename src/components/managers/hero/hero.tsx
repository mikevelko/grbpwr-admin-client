import { FC } from 'react';
import { useNavigate } from '@tanstack/react-location';
import { ROUTES } from 'constants/routes';
import styles from 'styles/product.scss';
import { Layout } from 'components/login/layout';

export const Hero: FC = () => {
  const navigate = useNavigate();

  const navigateAddProduct = () => {
    navigate({ to: ROUTES.addHero, replace: true });
  };

  const navigatePagedProduct = () => {
    console.log('Navigate to LIST PRODUCTS');
    navigate({ to: ROUTES.getHero, replace: true });
  };
  return (
    <Layout>
      <div className={styles.product_operation_wrapper}>
        <button onClick={navigatePagedProduct}>LIST HERO</button>
        <button onClick={navigateAddProduct}>ADD HERO</button>
      </div>
    </Layout>
  );
};
