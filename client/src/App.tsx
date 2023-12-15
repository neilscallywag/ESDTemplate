import React, { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

import PublicRoute from "~shared/PublicRoute";
import rehydrateStore from "~shared/store/RehydrateStore";

const DashboardPage = lazy(() => import("~features/dashboard/Dashboard"));
const LandingPage = lazy(() => import("~features/landing/Landing"));
const Navbar = lazy(() => import("~shared/components/navbar/Navbar"));
const Footer = lazy(() => import("~shared/components/footer/Footer"));

const App: React.FC = () => {
  useEffect(() => {
    rehydrateStore();
  }, []);

  return (
    <Flex direction="column" minH="100vh">
      <Suspense fallback={"Loading"}>
        <Navbar />
        <Box flex="1">
          <Routes>
            {/* This is public route, later can add check to redirect authenticated user back to dashboard */}
            Can move this Route and public route checking
            <Route element={<PublicRoute strict={true} />}>
              <Route path="/" element={<LandingPage />} />
            </Route>
            {/* This is private route, only authenticated user can access this route */}
            {/* /dashboard/* means that all paths starting with /dashboard/ will be handled by DashboardPage. */}
            <Route path="/dashboard/*" element={<DashboardPage />} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </Box>
        <Footer />
      </Suspense>
    </Flex>
  );
};

export default App;
