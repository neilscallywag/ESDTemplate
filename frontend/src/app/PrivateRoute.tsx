import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { LOGIN_ROUTE } from '~constants/routes';

import { useAuth } from '~auth/AuthContext';

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to={LOGIN_ROUTE} />;
};
