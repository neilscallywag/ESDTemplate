import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import PermissionService from "~shared/services/permission/Permission.service";

import { useAuth } from "~features/auth";

interface PrivateRouteProps {
  resource: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ resource }) => {
  const { isAuthenticated } = useAuth();
  const permissionService = new PermissionService();
  const hasRequiredPermissions =
    isAuthenticated && permissionService.can(resource);
  return hasRequiredPermissions ? (
    <Outlet />
  ) : (
    <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
  );
};

export default PrivateRoute;

// Usage:

/*
 * <Route element={<PrivateRoute resource="resource name1" />}>
 *  <Route index element={<Component1 />} />
 * </Route>
 * <Route element={<PrivateRoute resource="resource name2" />}>
 *  <Route path="path" element={<Component2 />} />
 * </Route>
 */
