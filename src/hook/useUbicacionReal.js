// useUbicacionReal.js
import { useEffect, useState } from "react";

export const useUbicacionReal = ({ usuarioId, camionId, activo }) => {
  const [ubicacion, setUbicacion] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (!activo) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUbicacion(coords);
      },
      (err) => console.error("❌ Error al obtener ubicación:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [activo, usuarioId, camionId]);

  return ubicacion;
};
