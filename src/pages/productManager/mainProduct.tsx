import { FC } from 'react';
import { useNavigate } from '@tanstack/react-location';
import { ROUTES } from 'constants/routes';
import { Layout } from 'components/layout';

export const Product: FC = () => {
  const navigate = useNavigate();

  const navigateAddProduct = () => {
    navigate({ to: ROUTES.addProduct, replace: true });
  };

  const navigatePagedProduct = () => {
    navigate({ to: ROUTES.pagedProduct, replace: true });
  };
  return (
    <Layout>
      <button onClick={navigatePagedProduct}>LIST PRODUCTS</button>
      <button onClick={navigateAddProduct}>ADD PRODUCT</button>
    </Layout>
  );
};
