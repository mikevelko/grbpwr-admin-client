import { FC } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { DefaultGenerics } from '@tanstack/react-location';
import { Navigate, useNavigate } from 'react-router';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectTo: string; // The path to redirect to if not authenticated
  component: React.ComponentType<any>;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  isAuthenticated,
  redirectTo,
  component: Component,
  ...rest
}) => {
  const location = useLocation();
  const navigate = useNavigate(); // Use the useNavigate hook to get the navigation function

  return (
    <Route
      {...rest}
      element={
        isAuthenticated ? (
          <Component />
        ) : (
          <Navigate to={redirectTo} replace={true} /> // Use navigate for redirection
        )
      }
    />
  );
};

export default ProtectedRoute;
