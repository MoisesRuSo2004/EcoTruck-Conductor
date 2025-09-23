// src/services/authService.js
import api from "./api";

// 🔐 Login
export const LoginAuth = async (correo, password) => {
  try {
    const response = await api.post("/auth/login", { correo, password });

    const { token, rol } = response.data;

    if (!token || !rol) {
      throw new Error("Respuesta inválida del servidor");
    }

    const rolNormalizado = rol.replace("ROLE_", "");

    localStorage.setItem("token", token);
    localStorage.setItem("rol", rolNormalizado);

    return { token, rol: rolNormalizado };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.statusText ||
      "Error al iniciar sesión";
    throw new Error(message);
  }
};

// 🔓 Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
};

// 📦 Utilidades
export const getToken = () => localStorage.getItem("token");
export const getRol = () => localStorage.getItem("rol");

// 🧠 Extraer datos del token
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      correo: payload.sub,
      rol: payload.rol?.replace("ROLE_", ""),
      nombre: payload.nombre,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
};

// ⏳ Verificar expiración
export const isTokenExpired = () => {
  const user = getUserFromToken();
  if (!user?.exp) return true;
  return user.exp * 1000 < Date.now();
};
