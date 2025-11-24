import api from "./api";

export const obtenerUsuarioActual = async () => {
  const res = await api.get("/usuarios/perfil");
  return res.data; // contiene _id, nombre, correo, rol, etc.
};
