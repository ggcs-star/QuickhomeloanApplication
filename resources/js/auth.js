import { router } from '@inertiajs/react';

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
 router.visit('/login');
};