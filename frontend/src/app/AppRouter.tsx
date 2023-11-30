import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { DASHBOARD_ROUTE, LOGIN_ROUTE, ROOT_ROUTE } from '~constants/routes';

import { PrivateRoute } from '~app/PrivateRoute';
import { PublicRoute } from '~app/PublicRoute';

// Lazy-loaded components
const LandingPage = lazy(() => import('~features/landing'));
const DashboardPage = lazy(() => import('~features/dashboard'));
const BoundBoxPage = lazy(
  () => import('../features/experimental/boundingbox/index'),
);

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={'Loading'}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute strict={true} />}>
          <Route path={ROOT_ROUTE} element={<LandingPage />} />
          <Route path={LOGIN_ROUTE} element={<LandingPage />} />
          <Route path={'/experimental'} element={<BoundBoxPage />} />
        </Route>

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path={DASHBOARD_ROUTE} element={<DashboardPage />} />
        </Route>

        <Route path="*" element={'404 not found'} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
