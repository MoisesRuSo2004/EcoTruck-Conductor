import { createContext, useContext, useState, useRef, useEffect } from "react";

export const SimulacionContext = createContext();

export const useSimulacion = () => useContext(SimulacionContext);

export const SimulacionProvider = ({ children }) => {
  const [ubicacion, setUbicacion] = useState(null);
  const [heading, setHeading] = useState(0);
  const [simulando, setSimulando] = useState(false);
  const [rutaActiva, setRutaActiva] = useState(false); // ✅ MOVIDO AQUÍ
  const [puntos, setPuntos] = useState([]);
  const intervaloRef = useRef(null);
  const indiceRef = useRef(0);

  const reiniciarSimulacion = () => {
    clearInterval(intervaloRef.current);
    intervaloRef.current = null;
    setSimulando(false);
    setHeading(0);
    setPuntos([]);
    setUbicacion(null);
    setRutaActiva(false);
    indiceRef.current = 0;
  };

  const iniciarSimulacion = (puntosInterpolados) => {
    if (!puntosInterpolados || puntosInterpolados.length === 0) return;

    setPuntos(puntosInterpolados);
    setUbicacion(puntosInterpolados[0]);
    setSimulando(true);
    setRutaActiva(true);
    indiceRef.current = 0;

    intervaloRef.current = setInterval(() => {
      const actual = puntosInterpolados[indiceRef.current];
      const siguiente = puntosInterpolados[indiceRef.current + 1];

      setUbicacion(actual);

      if (siguiente) {
        const deltaLat = siguiente.lat - actual.lat;
        const deltaLng = siguiente.lng - actual.lng;
        const angulo = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);
        const normalizado = (angulo + 360) % 360;
        setHeading((normalizado + 90) % 360);
      }

      indiceRef.current++;

      if (indiceRef.current >= puntosInterpolados.length) {
        detenerSimulacion();
      }
    }, 500);
  };

  const detenerSimulacion = () => {
    clearInterval(intervaloRef.current);
    intervaloRef.current = null;
    setSimulando(false);
    setHeading(0);
    setPuntos([]);
    setRutaActiva(false);
    indiceRef.current = 0;
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
