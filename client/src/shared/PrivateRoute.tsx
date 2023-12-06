import React from "react";
import { Navigate, Route } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrivateRoute = ({ component, isAuthenticated, ...rest }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeComponent = (props: any) =>
    isAuthenticated ? (
      React.createElement(component, props)
    ) : (
      <Navigate to={{ pathname: "/" }} />
    );
  return <Route {...rest} render={routeComponent} />;
};

export default PrivateRoute;
