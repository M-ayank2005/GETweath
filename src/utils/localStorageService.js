// utils/localStorageService.js
export const getStoredData = (key) => localStorage.getItem(key);
export const setStoredData = (key, value) => localStorage.setItem(key, value);
