import React, { FC } from 'react';
import { Layout } from 'components/login/layout';
import { MediaPicker } from './mediaPicker';

export const Hero: FC = () => {
  return (
    <Layout>
      <MediaPicker />
    </Layout>
  );
};
