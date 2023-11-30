import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

import { DASHBOARD_ROUTE } from '~constants/routes';

import { useAuth } from '~features/auth';

export const PublicRoute = ({ strict }: { strict: boolean }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated && strict ? (
    <Navigate to={DASHBOARD_ROUTE} />
  ) : (
    <Outlet />
  );
};

PublicRoute.propTypes = {
  strict: PropTypes.bool,
};
