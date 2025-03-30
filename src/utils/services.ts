const isBrowser = typeof window !== "undefined";

export const setToken = (tokenType: string, token: string) => {
  if (isBrowser) {
    localStorage.setItem(tokenType, token);
  }
};

export const getToken = (tokenType: string) => {
  if (isBrowser) {
    const storage = localStorage.getItem(tokenType);
    if (storage) return JSON.parse(storage);
  }
  return;
};

export const deleteToken = (tokenType: string) => {
  if (isBrowser) {
    if (localStorage) localStorage.removeItem(tokenType);
  }
};
