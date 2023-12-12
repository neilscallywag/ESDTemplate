import "inter-ui/inter.css";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import customTheme from "~shared/theme";

import { TitleProvider } from "./features/page-header/title/TitleContext";
import App from "./App";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ChakraProvider theme={customTheme}>
        <GoogleOAuthProvider
          clientId={
            import.meta.env.VITE_GOOGLE_CLIENT_ID || "Nothing-Ever-Works"
          }
        >
          <BrowserRouter>
            <TitleProvider>
              <App />
            </TitleProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </ChakraProvider>
    </React.StrictMode>,
  );
}
