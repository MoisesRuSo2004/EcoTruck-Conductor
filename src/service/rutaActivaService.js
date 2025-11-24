import api from "./api"; // usa la instancia Axios con token

// Iniciar ruta activa
export const iniciarRutaActiva = async ({ usuarioId, lat, lng }) => {
  return api.post("/ruta-activa/iniciar", { usuarioId, lat, lng });
};

// Actualizar ubicación
export const actualizarUbicacionRuta = async ({ usuarioId, lat, lng }) => {
  console.log("📤 Enviando ubicación al backend:", { usuarioId, lat, lng });
  return api.post("/ruta-activa/actualizar", { usuarioId, lat, lng });
};

// Finalizar ruta
export const finalizarRutaActiva = async (usuarioId) => {
  return api.post("/ruta-activa/finalizar", { usuarioId });
};

// Obtener rutas activas (para ciudadano)
export const obtenerRutasActivas = async () => {
  return api.get("/ruta-activa/activas");
};
