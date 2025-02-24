import type { AxiosError } from "axios";
import type { KeyedMutator } from "swr";

export interface ApiResponseSwr<T> {
  data?: T;
  error?: AxiosError;
  isLoading: boolean;
  mutate: KeyedMutator<T>;
}
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageCount: number;
  pageIndex: number;
  hasNext: boolean;
  hasPrev: boolean;
}
export interface ErrorResponse {
  title?: string;
  issues?: Array<{
    message: string;
    path: string;
  }>;
}

export interface Token {
  accessToken: string;
  expirationUtc: string;
}

export interface ApiError {
  title?: string;
  code?: string;
  type?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface SearchParams {
  page?: string;
  size?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  roles?: string;
  tab?: string;
  location?: string;
  tags?: string;
  fileName?: string;
}
