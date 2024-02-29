import React, { FC } from 'react';
import { useNavigate } from '@tanstack/react-location';
import { Layout } from 'components/login/layout';
import styles from 'styles/mainArchive.scss';
import { ROUTES } from 'constants/routes';

export const MainArchive: FC = () => {
  const navigate = useNavigate();

  const createArchiveNavigate = () => {
    navigate({ to: ROUTES.createArchive, replace: true });
  };

  const getArchiveNavigate = () => {
    navigate({ to: ROUTES.getArchive, replace: true });
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <button className={styles.btn} onClick={createArchiveNavigate}>
            create archive
          </button>
          <button className={styles.btn} onClick={getArchiveNavigate}>
            list archives
          </button>
        </div>
      </div>
    </Layout>
  );
};
