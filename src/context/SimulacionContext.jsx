import { createContext, useContext, useState, useRef, useEffect } from "react";
import { actualizarUbicacion } from "../service/rutaService";

export const SimulacionContext = createContext();
export const useSimulacion = () => useContext(SimulacionContext);

export const SimulacionProvider = ({ children }) => {
  const [ubicacion, setUbicacion] = useState(null);
  const [heading, setHeading] = useState(0);
  const [simulando, setSimulando] = useState(false);
  const [rutaActiva, setRutaActiva] = useState(false);
  const [puntos, setPuntos] = useState([]);

  const intervaloRef = useRef(null);
  const indiceRef = useRef(0);
  const rutaIdRef = useRef(null);

  const reiniciarSimulacion = () => {
    console.log("🔄 Reiniciando simulación");
    clearInterval(intervaloRef.current);
    intervaloRef.current = null;
    setSimulando(false);
    setHeading(0);
    setPuntos([]);
    setUbicacion(null);
    setRutaActiva(false);
    indiceRef.current = 0;
    rutaIdRef.current = null;
  };

  const iniciarSimulacion = (puntosInterpolados, rutaId) => {
    console.log("🚀 Iniciando simulación...");
    if (!puntosInterpolados || puntosInterpolados.length === 0) {
      console.warn("⚠️ No hay puntos para simular");
      return;
    }

    if (!rutaId) {
      console.warn("⚠️ No se recibió rutaId");
      return;
    }

    if (intervaloRef.current) {
      console.warn("⚠️ Simulación ya está corriendo");
      return;
    }

    console.log("✅ Ruta activa:", rutaId);
    rutaIdRef.current = rutaId;
    setPuntos(puntosInterpolados);
    setUbicacion(puntosInterpolados[0]);
    setSimulando(true);
    setRutaActiva(true);
    indiceRef.current = 0;

    intervaloRef.current = setInterval(() => {
      const actual = puntosInterpolados[indiceRef.current];
      const siguiente = puntosInterpolados[indiceRef.current + 1];

      if (!actual) {
        console.warn("⚠️ Punto actual indefinido en índice", indiceRef.current);
        return;
      }

      setUbicacion(actual);
      console.log(`📍 Paso ${indiceRef.current + 1}:`, actual);

      if (siguiente) {
        const deltaLat = siguiente.lat - actual.lat;
        const deltaLng = siguiente.lng - actual.lng;
        const angulo = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);
        const normalizado = (angulo + 360) % 360;
        setHeading((normalizado + 90) % 360);
      }

      if (rutaIdRef.current) {
        console.log("📤 Enviando al backend:", actual);
        actualizarUbicacion(rutaIdRef.current, actual).catch((err) =>
          console.error("❌ Error al enviar ubicación:", err)
        );
      } else {
        console.warn("⚠️ rutaIdRef está vacío");
      }

      indiceRef.current++;

      if (indiceRef.current >= puntosInterpolados.length) {
        console.log("✅ Simulación completada");
        detenerSimulacion();
      }
    }, 500);
  };

  const detenerSimulacion = () => {
    console.log("🛑 Deteniendo simulación");
    clearInterval(intervaloRef.current);
    intervaloRef.current = null;
    setSimulando(false);
    setHeading(0);
    setPuntos([]);
    setRutaActiva(false);
    indiceRef.current = 0;
    rutaIdRef.current = null;
  };

  useEffect(() => {
    return () => {
      clearInterval(intervaloRef.current);
    };
  }, []);

  return (
    <SimulacionContext.Provider
      value={{
        ubicacion,
        heading,
        simulando,
        rutaActiva,
        iniciarSimulacion,
        detenerSimulacion,
        reiniciarSimulacion,
        puntos,
      }}
    >
      {children}
    </SimulacionContext.Provider>
  );
};
