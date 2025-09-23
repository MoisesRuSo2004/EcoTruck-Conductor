// src/api.js
import axios from "axios";

// 🔧 Instancia base de Axios
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🛡️ Interceptor para agregar el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isAuthRoute =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register");

  if (!isAuthRoute && token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPage = window.location.pathname === "/";

    if (error.response?.status === 401 && !isLoginPage) {
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      window.location.href = "/";
    }

    // ✅ Manejo silencioso del 404 para asignaciones
    if (
      error.response?.status === 404 &&
      error.config.url?.includes("/asignaciones/conductor")
    ) {
      return Promise.resolve({ data: null }); // evita que Axios lo trate como error
    }

    return Promise.reject(error);
  }
);

export default api;
