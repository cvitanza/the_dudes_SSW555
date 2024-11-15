// services/authService.js
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');
