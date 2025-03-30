"use client";
import type {
  ApiResponse,
  ErrorResponse,
  ApiResponseSwr,
  Token,
} from "@/types/dto/Axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import HttpStatusCode from "@/types/enums/HttpStatusCode";
import axios from "axios";
import swr from "swr";
import { deleteToken, getToken } from "./services";

const baseURL = process.env.NEXT_PUBLIC_API;

const TOKEN_KEY = "TOKEN";
const USER_KEY = "USER";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const isTokenExpired = (token: Token): boolean => {
  try {
    if (!token.expirationUtc) {
      return true;
    }
    const expirationTime = new Date(token.expirationUtc).getTime();
    const currentTime = new Date().getTime();
    return expirationTime < currentTime;
  } catch {
    return true;
  }
};

export const logout = () => {
  deleteToken(TOKEN_KEY);
  deleteToken(USER_KEY);
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

const handleTokenExpiration = () => {
  deleteToken(TOKEN_KEY);
  deleteToken(USER_KEY);
  location.href = "/login";
};

const handleNotAuthorized = () => {
  location.href = "/not-authorized";
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getToken(TOKEN_KEY);
      if (token && !isTokenExpired(token)) {
        config.headers["Authorization"] = `Bearer ${token.accessToken}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as ErrorResponse;

      if (errorData.title) {
        error.message = errorData.title;
      }

      if (errorData.issues && errorData.issues.length > 0) {
        error.message = `${errorData.issues[0].message} on ${errorData.issues[0].path} field`;
      }

      if (error.response.status === HttpStatusCode.NOT_AUTHENTICATED) {
        handleTokenExpiration();
      }

      if (error.response.status === HttpStatusCode.FORBIDDEN) {
        handleNotAuthorized();
      }
    }

    return Promise.reject(error);
  }
);

const getRequest = async <T>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
  try {
    const { data } = await axiosInstance.get<T>(url, config);
    return { data };
  } catch (err) {
    const error = err as AxiosError;
    return {
      error: error.response?.data || { title: error.message },
    };
  }
};

const postRequest = async <T, U>(
  url: string,
  payload: U,
  config: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
  try {
    const { data } = await axiosInstance.post<T>(url, payload, config);
    return { data };
  } catch (err) {
    const error = err as AxiosError;
    return {
      error: error.response?.data || { title: error.message },
    };
  }
};

const putRequest = async <T, U>(
  url: string,
  payload: U
): Promise<ApiResponse<T>> => {
  try {
    const { data } = await axiosInstance.put<T>(url, payload);
    return { data };
  } catch (err) {
    const error = err as AxiosError;
    return {
      error: error.response?.data || { title: error.message },
    };
  }
};

const deleteRequest = async <T, U = undefined>(
  url: string,
  datas?: U
): Promise<ApiResponse<T>> => {
  try {
    const { data } = await axiosInstance.delete<T>(
      url,
      datas ? { data: datas } : undefined
    );
    return { data };
  } catch (err) {
    const error = err as AxiosError;
    return {
      error: error.response?.data || { title: error.message },
    };
  }
};

const getRequestSwr = <T>(url: string): ApiResponseSwr<T> => {
  const excludedErrors = [
    HttpStatusCode.NOT_AUTHENTICATED,
    HttpStatusCode.FORBIDDEN,
  ];

  const fetcher = async (url: string) =>
    await axiosInstance
      .get(url)
      .then((res) => res.data)
      .catch((error) => {
        if (!excludedErrors.includes(error.status)) {
          throw new Error(error.message);
        }
      });

  return swr<T>(url, fetcher, {
    revalidateOnReconnect: false,
    keepPreviousData: true,
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
};

export {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  getRequestSwr,
  TOKEN_KEY,
  USER_KEY,
};
export default axiosInstance;
