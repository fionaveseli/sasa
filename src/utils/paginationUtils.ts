import { SearchParams } from "@/types/dto/axios";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const getSearchParams = (
  searchParams: URLSearchParams
): SearchParams => {
  const params: SearchParams = {};
  searchParams.forEach((value: string, key: string) => {
    params[key as keyof SearchParams] = value;
  });
  return params;
};

export const setSearchParams = (
  router: AppRouterInstance,
  pathname: string,
  searchParams: URLSearchParams,
  params: Record<string, unknown>
) => {
  let url = "";
  const search = new URLSearchParams(searchParams.toString());
  Object.entries(params).forEach(([key, value]) => {
    search.set(key, value as string);
  });
  url = pathname + "?" + search;
  router.push(url);
};

export const deleteSearchParams = (
  router: AppRouterInstance,
  pathname: string,
  searchParams: URLSearchParams,
  keysToDelete: string[]
) => {
  let url = "";
  const search = new URLSearchParams(searchParams.toString());
  keysToDelete.forEach((key) => {
    search.delete(key);
  });
  url = pathname + "?" + search;
  router.push(url);
};

export const getPaginationNumbers = (
  currentPage: number,
  totalPages: number
) => {
  const pageNumbers = [];
  const startPage = Math.max(1, currentPage);
  const endPage = Math.min(totalPages, currentPage + 2);
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
};

export const handleSearch = (
  router: AppRouterInstance,
  pathname: string,
  searchParams: URLSearchParams,
  value: string
) => {
  if (value) {
    setSearchParams(router, pathname, searchParams, {
      page: 0,
      search: value,
    });
    return;
  }
  deleteSearchParams(router, pathname, searchParams, ["search"]);
};

export const handlePage = (
  router: AppRouterInstance,
  pathname: string,
  searchParams: URLSearchParams,
  pageNumber: number
) => {
  setSearchParams(router, pathname, searchParams, {
    page: pageNumber,
  });
};

export const handleSize = (
  router: AppRouterInstance,
  pathname: string,
  searchParams: URLSearchParams,
  size: number
) => {
  setSearchParams(router, pathname, searchParams, {
    page: 0,
    size: size,
  });
};

export const handleTab = (
  router: AppRouterInstance,
  pathname: string,
  searchParams: URLSearchParams,
  tab: string
) => {
  setSearchParams(router, pathname, searchParams, {
    tab: tab,
  });
};
