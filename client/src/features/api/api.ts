import { useToast, UseToastOptions } from "@chakra-ui/react";
import { CodeResponse } from "@react-oauth/google";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const handleResponse = async <T>(
  response: AxiosResponse<T>,
): Promise<T> => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(`HTTP error! Status: ${response.status}`);
};

export const createErrorHandler =
  (toast: ReturnType<typeof useToast>) => (error: AxiosError) => {
    if (error.response) {
      const toastOptions: UseToastOptions = {
        title: "Error",
        description: error.response.data as string,
        status: "error",
        duration: 9000,
        isClosable: true,
      };
      toast(toastOptions);
    } else if (error.request) {
      const toastOptions: UseToastOptions = {
        title: "Error",
        description: "No response received from the server.",
        status: "error",
        duration: 9000,
        isClosable: true,
      };
      toast(toastOptions);
    } else {
      const toastOptions: UseToastOptions = {
        title: "Error",
        description: `Failed setting up the request: ${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      };
      toast(toastOptions);
    }
  };

export const createGoogleErrorHandler =
  (toast: ReturnType<typeof useToast>) => (error: CodeResponse) => {
    if (error.error_description) {
      const toastOptions: UseToastOptions = {
        title: "Error",
        description: error.error_description
          ? error.error_description
          : "An error occurred.",
        status: "error",
        duration: 9000,
        isClosable: true,
      };
      toast(toastOptions);
    } else {
      const toastOptions: UseToastOptions = {
        title: "Error",
        description: `Failed setting up google request: ${error}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      };
      toast(toastOptions);
    }
  };

// Usage in a component:

/*
 * const toast = useToast();
 * api.get<ResponseType>('/some-endpoint')
 *   .then(handleResponse)
 *   .catch(createErrorHandler(toast));
 */

// Replace ResponseType with the expected response data type from the API.
