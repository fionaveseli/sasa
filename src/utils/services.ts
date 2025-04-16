const isBrowser = typeof window !== "undefined";

export const setToken = (tokenType: string, token: string) => {
  if (isBrowser) {
    localStorage.setItem(tokenType, token);
  }
};

export const getToken = (tokenType: string): string | null => {
  if (isBrowser) {
    return localStorage.getItem(tokenType);
  }
  return null;
};

export const deleteToken = (tokenType: string) => {
  if (isBrowser) {
    localStorage.removeItem(tokenType);
  }
};
