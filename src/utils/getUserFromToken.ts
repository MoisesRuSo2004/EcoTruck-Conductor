export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token || !token.includes(".")) return null;

  try {
    const [_, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));

    return {
      nombre: payload.nombre || "Sin nombre",
      correo: payload.sub || "Sin correo",
      rol: payload.rol?.replace("ROLE_", "") || "Sin rol",
      exp: payload.exp,
    };
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
};
