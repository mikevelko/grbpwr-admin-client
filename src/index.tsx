import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Outlet, ReactLocation, Router, Route, DefaultGenerics } from '@tanstack/react-location';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContextProvider } from 'context';
import { ROUTES } from 'constants/routes';
import { LoginBlock } from 'components/LoginBlock';
import MainContent from 'pages/MainContent';
import 'styles/global.scss';
import styles from 'styles/index.module.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

const queryClient = new QueryClient();
const location = new ReactLocation();
const routes: Route<DefaultGenerics>[] = [
  { path: ROUTES.login, element: <LoginBlock /> },
  { path: ROUTES.main, element: <MainContent/> },
];

root.render(
  <StrictMode>
    <ContextProvider>
      <QueryClientProvider client={queryClient}>
        <Router location={location} routes={routes}>
          <header className={styles.header}>
            <LoginBlock />
          </header>
            <Outlet />
        </Router>
      </QueryClientProvider>
    </ContextProvider>
  </StrictMode>,
);
