import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AppRouter from "~app/AppRouter";
import { AuthProvider } from "~auth/index";

export const App = () => (
  <ChakraProvider theme={theme}>
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "Nothing-Ever-Works"}
    >
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </ChakraProvider>
);
