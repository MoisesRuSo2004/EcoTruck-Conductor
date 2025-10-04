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

  if (!isAuthRoute) {
    if (!token) {
      console.warn("🚫 No se encontró token en localStorage");
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;
        const now = Date.now();

        if (now > exp) {
          console.warn("⚠️ Token expirado. Eliminando...");
          localStorage.removeItem("token");
        } else {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
          console.log("🔐 Token válido agregado al header:", token);
        }
      } catch (e) {
        console.error("❌ Error al decodificar el token:", e);
      }
    }
  }

  return config;
});

// 🚨 Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPage = window.location.pathname === "/";
    const status = error.response?.status;
    const url = error.config?.url;

    console.error("❌ Error en respuesta Axios:");
    console.log("🔗 URL:", url);
    console.log("📦 Status:", status);
    console.log("📄 Data:", error.response?.data);
    console.log("📋 Headers:", error.response?.headers);

    if (status === 401 && !isLoginPage) {
      alert("⚠️ No tienes permisos para realizar esta acción.");
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (status === 404 && url?.includes("/asignaciones/conductor")) {
      console.warn("📭 Asignación no encontrada, devolviendo null.");
      return Promise.resolve({ data: null });
    }

    return Promise.reject(error);
  }
);

export default api;
