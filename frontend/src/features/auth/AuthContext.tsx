import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";

import {
  GOOGLE_AUTH_KEY,
  USER_EMAIL,
  USER_NAME,
  USER_ROLE,
  WHO_AM_I,
} from "~constants/auth";

import { useLocalStorage } from "./UseLocalStorage";

import { api, createErrorHandler, handleResponse } from "~api";

interface AuthContextType {
  isAuthenticated: boolean | undefined;
  whoAmI: string | undefined;
  userRole: string | undefined;
  userEmail: string | undefined;
  userName: string | undefined;
  googleAuth: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useProvideAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider component");
  }
  return context;
};

const useProvideAuth = (): AuthContextType => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<
    boolean | undefined
  >(GOOGLE_AUTH_KEY);
  const [whoAmI, setWhoAmI] = useLocalStorage<string | undefined>(WHO_AM_I);
  const [userRole, setUserRole] = useLocalStorage<string | undefined>(
    USER_ROLE,
  );
  const [userEmail, setUserEmail] = useLocalStorage<string | undefined>(
    USER_EMAIL,
  );
  const [userName, setUserName] = useLocalStorage<string | undefined>(
    USER_NAME,
  );

  const toast = useToast();

  const navigate = useNavigate();

  const googleLogin = (): void => {
    setIsAuthenticated(true);
  };

  const googleAuth = (): void => {
    googleLogin();
    setWhoAmI("Neil");
    setUserRole("STUDENT");
    setUserEmail("Neil.sharma.2022@scis.smu.edu.sg");
    setUserName("Neil SHARMA");
    navigate("/dashboard");
  };

  // const googleAuth = useGoogleLogin({
  //   onSuccess: async ({ code }): Promise<void> => {
  //     try {
  //       await new Promise<void>((resolve) => {
  //         setTimeout(resolve, 0);
  //       });

  //       const response = await api.post('/auth/google/callback', { code });

  //       // Handle the response using the provided function
  //       const data = await handleResponse(response);
  //       googleLogin();
  //       setWhoAmI(data.user);
  //       setUserRole(data.role);
  //       setUserEmail(data.email);
  //       setUserName(data.name);
  //       navigate('/dashboard');
  //     } catch (error) {
  //       createErrorHandler(toast)(error as AxiosError<unknown, any>); // using the modified errorHandler to use toast
  //     }
  //   },
  //   onError: (error): void => {
  //     toast({
  //       title: 'Google Login Error',
  //       description: error.error_description
  //         ? error.error_description
  //         : 'An error occurred.',
  //       status: 'error',
  //       duration: 9000,
  //       isClosable: true,
  //     });
  //   },
  //   flow: 'auth-code',
  // });

  const checkSessionStatus = async (): Promise<boolean | undefined> => {
    try {
      const response = await api.get("/auth/checkSession");
      if (response.data && typeof response.data.isAuthenticated === "boolean") {
        // we reset user roles here
        const tempRole = response.data.role ? "STAFF" : "STUDENT";
        const localRole = userRole;

        if (tempRole !== localRole) {
          setUserRole(tempRole);
        }

        // we reset everything if the isAuthenticated is changed
        if (response.data.isAuthenticated !== isAuthenticated) {
          setIsAuthenticated(response.data.isAuthenticated);
          setWhoAmI(response.data.user);
          if (response.data.role && typeof response.data.role === "boolean") {
            setUserRole("STAFF");
          } else {
            setUserRole("STUDENT");
          }
          setUserEmail(response.data.email);
          setUserName(response.data.name);
        }
        return response.data.isAuthenticated;
      }
    } catch (error) {
      // console.error('Failed to check session status:', error);
    }
  };

  const googleLogout = useCallback((): void => {
    setIsAuthenticated(undefined);
    setWhoAmI(undefined);
    setUserRole(undefined);
    setUserEmail(undefined);
    setUserName(undefined);
    localStorage.clear();
  }, [setIsAuthenticated, setWhoAmI, setUserRole, setUserEmail, setUserName]);

  const logout = async (): Promise<void> => {
    // const response = await api.post('/auth/logout');
    // if (response.status === 200) {
    if (isAuthenticated) {
      googleLogout();
    }
    // }
  };

  useEffect(() => {
    checkSessionStatus();
  }, [isAuthenticated, userEmail, userName, whoAmI, userRole]);

  return {
    isAuthenticated,
    whoAmI,
    userRole,
    userEmail,
    userName,
    googleAuth,
    logout,
  };
};

export default AuthProvider;
