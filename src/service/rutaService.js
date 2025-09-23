import api from "./api";

export const getRutaById = async (id) => {
  const response = await api.get(`/rutas/${id}`);
  return response.data;
};
