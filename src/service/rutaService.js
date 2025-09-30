import api from "./api";

// Obtener ruta por ID
export const getRutaById = async (id) => {
  const response = await api.get(`/rutas/${id}`);
  return response.data;
};

// Iniciar ruta
export const iniciarRuta = async (id) => {
  const response = await api.post(`/rutas/iniciar/${id}`);
  return response.data;
};

// Finalizar ruta
export const finalizarRuta = async (id) => {
  const response = await api.post(`/rutas/finalizar/${id}`);
  return response.data;
};

// Consultar estado actual
export const consultarEstadoRuta = async (id) => {
  const response = await api.get(`/rutas/estado/${id}`);
  return response.data;
};
