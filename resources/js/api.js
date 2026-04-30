import axios from "axios";
import { router } from "@inertiajs/react";

const api = axios.create({
  baseURL: "https://backend.quickhomeloan.in/public/api",
});

/* ================= REQUEST ================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  /* 🔥 IMPORTANT: Disable cache (NativePHP fix) */
  config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
  config.headers["Pragma"] = "no-cache";
  config.headers["Expires"] = "0";

  /* 🔥 Break WebView cache */
  config.params = {
    ...(config.params || {}),
    _t: Date.now(), // unique every request
  };

  return config;
});

/* ================= RESPONSE ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      router.visit("/login");
    }

    return Promise.reject(error);
  }
);

export default api;