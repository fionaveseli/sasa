import { SearchParams } from "@/types/dto/Axios";
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
  // If there are 10 or fewer items, only show page 1
  if (totalPages <= 1) {
    return [1];
  }

  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  if (totalPages <= maxVisiblePages) {
    // If total pages is less than or equal to max visible pages, show all pages
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate start and end of visible pages
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust if we're near the start or end
    if (currentPage <= 2) {
      endPage = 4;
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - 3;
    }
    
    // Add ellipsis if needed
    if (startPage > 2) {
      pageNumbers.push(-1); // -1 represents ellipsis
    }
    
    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push(-1);
    }
    
    // Always show last page
    pageNumbers.push(totalPages);
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
