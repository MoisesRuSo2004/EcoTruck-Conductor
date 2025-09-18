import axios from "axios";
import Login from "../pages/Login";

const API_URL = "http://localhost:8080/api/auth"; // Ajusta si usas otro puerto o ruta

// Login
export const LoginAuth = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    const { token, rol } = response.data;

    // Guardar en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("rol", rol);

    return { token, rol };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error en login");
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("rol");
};

// Obtener token
export const getToken = () => localStorage.getItem("token");

// Obtener rol
export const getRol = () => localStorage.getItem("rol");
