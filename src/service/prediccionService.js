import api from "./api";

export const enviarPrediccionDesdeConductor = async (datos) => {
  const response = await api.post("/prediccion", datos);
  return response.data;
};
