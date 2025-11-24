export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token || !token.includes(".")) {
    console.warn("⚠️ Token no encontrado o mal formado");
    return null;
  }

  try {
    const [_, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));

    console.log("🔓 Token decodificado:", payload);

    const ahora = Math.floor(Date.now() / 1000);
    const expirado = payload.exp && payload.exp < ahora;

    return {
      nombre: payload.nombre || "Sin nombre",
      correo: payload.sub || "Sin correo",
      rol: Array.isArray(payload.roles)
        ? payload.roles[0]?.replace("ROLE_", "") || "Sin rol"
        : "Sin rol",
      exp: payload.exp,
      expirado,
    };
  } catch (error) {
    console.error("❌ Error al decodificar token:", error);
    return null;
  }
};
