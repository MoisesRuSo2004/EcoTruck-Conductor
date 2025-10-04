import api from "./api";

// Obtener ruta por ID
export const getRutaById = async (id) => {
  try {
    const response = await api.get(`/rutas/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener ruta:", error);
    throw new Error("No se pudo obtener la ruta.");
  }
};

// Iniciar ruta
export const iniciarRuta = async (id, puntosInterpolados) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post(
      `/rutas/iniciar/${id}`,
      { puntosInterpolados },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const msg = error.response?.data;

    if (error.response?.status === 400) {
      if (msg.includes("La ruta ya está en estado ACTIVA")) {
        console.warn("⚠️ Ruta ya activa");
        throw new Error(
          "La ruta ya está activa. No puedes iniciarla nuevamente."
        );
      }

      if (msg.includes("No se recibieron puntos interpolados")) {
        console.warn("⚠️ Puntos faltantes");
        throw new Error(
          "No se pudo iniciar la ruta. Verifica los puntos enviados."
        );
      }

      throw new Error("Error al iniciar la ruta: " + msg);
    }

    if (error.response?.status === 404) {
      console.warn("❌ Ruta no encontrada");
      throw new Error("La ruta no existe o el ID es inválido.");
    }

    console.error("❌ Error inesperado al iniciar ruta:", error);
    throw new Error("Error inesperado al iniciar la ruta.");
  }
};

// Finalizar ruta
export const finalizarRuta = async (id) => {
  try {
    const response = await api.post(`/rutas/finalizar/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al finalizar ruta:", error);
    throw new Error("No se pudo finalizar la ruta.");
  }
};

// Consultar estado actual
export const consultarEstadoRuta = async (id) => {
  try {
    const response = await api.get(`/rutas/estado/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al consultar estado de ruta:", error);
    throw new Error("No se pudo consultar el estado de la ruta.");
  }
};

export const actualizarUbicacion = async (id, coordenada) => {
  try {
    const response = await api.put(
      `/rutas/actualizar-ubicacion/${id}`,
      coordenada
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar ubicación:", error);
    throw error;
  }
};
