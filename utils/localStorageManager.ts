type Key = "memozang-memo";

export const LocalStorage = {
  getItem: (key: Key) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }

    return null;
  },
  setItem: (key: Key, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: Key, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
};
