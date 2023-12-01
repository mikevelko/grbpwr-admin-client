import React from 'react';
import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Outlet, ReactLocation, Router, Route, DefaultGenerics } from '@tanstack/react-location';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContextProvider } from 'context';
import { ROUTES } from 'constants/routes';
import { LoginBlock } from 'components/login';
import { UploadPage } from 'pages/mediaManager/upload';
import { Main } from 'pages/MainContent';
import { MediaManager } from 'pages/mediaManager/mediaManager';
import { Product } from 'pages/productManager/mainProduct';
import { AddProducts } from 'pages/productManager/addProduct';
// import { PageProduct } from 'pages/productManager/pageProduct';
// import { ProductById } from 'pages/productManager/productManagerComponents/singleProduct';
import 'styles/global.scss';
// import { ProductID } from 'pages/productManager/productID';

const container = document.getElementById('root') ?? document.body;
const root = createRoot(container);

const queryClient = new QueryClient();
const location = new ReactLocation();

const routes: Route<DefaultGenerics>[] = [
  { path: ROUTES.login, element: <LoginBlock /> },
  { path: ROUTES.main, element: <Main /> },
  { path: ROUTES.media, element: <MediaManager /> },
  { path: ROUTES.all, element: <UploadPage /> },
  { path: ROUTES.product, element: <Product /> },
  { path: ROUTES.addProduct, element: <AddProducts /> },
  // { path: ROUTES.pagedProduct, element: <PageProduct /> },
  // { path: ROUTES.singleProduct, element: <ProductID />}
];

root.render(
  <StrictMode>
    <ContextProvider>
      <QueryClientProvider client={queryClient}>
        <Router location={location} routes={routes}>
          <Outlet />
        </Router>
      </QueryClientProvider>
    </ContextProvider>
  </StrictMode>,
);
