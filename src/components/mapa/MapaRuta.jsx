import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import {
  getRutaById,
  iniciarRuta,
  finalizarRuta,
} from "../../service/rutaService";
import { useEffect, useState } from "react";
import polyline from "@mapbox/polyline";
import Indicaciones from "../indicaciones/Indicaciones";
import { useSimulacion } from "../../context/SimulacionContext";
import api from "../../service/api";

const MapaRuta = ({ rutaId }) => {
  const [mapRef, setMapRef] = useState(null);
  const [direcciones, setDirecciones] = useState(null);
  const [infoRuta, setInfoRuta] = useState({ distancia: "", duracion: "" });
  const [instrucciones, setInstrucciones] = useState([]);
  const [pasoActual, setPasoActual] = useState(null);
  const [puntosGuardados, setPuntosGuardados] = useState([]);

  const {
    ubicacion,
    heading,
    rutaActiva,
    iniciarSimulacion,
    detenerSimulacion,
    reiniciarSimulacion,
  } = useSimulacion();

  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  };

  const darkTheme = [
    { elementType: "geometry", stylers: [{ color: "#1d1d1d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#a3a3a3" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1d1d1d" }] },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#2c2c2c" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8a8a8a" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0e0e0e" }],
    },
  ];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA4cpX2UWFERFOLEWasaZo8cePYke-G1W0",
    language: "es",
    region: "CO",
  });

  useEffect(() => {
    if (!rutaId || !isLoaded) return;

    getRutaById(rutaId)
      .then((data) => {
        if (data.puntos?.length > 1) {
          const puntosRuta = data.puntos.map((p) => ({
            lat: p.lat,
            lng: p.lng,
          }));

          const origin = puntosRuta[0];
          const destination = puntosRuta[puntosRuta.length - 1];
          const waypoints = puntosRuta.slice(1, -1).map((p) => ({
            location: p,
            stopover: true,
          }));

          const directionsService = new window.google.maps.DirectionsService();

          directionsService.route(
            {
              origin,
              destination,
              waypoints,
              travelMode: window.google.maps.TravelMode.DRIVING,
              optimizeWaypoints: false,
            },
            async (result, status) => {
              if (status !== "OK") return;

              setDirecciones(result);

              const steps = result.routes[0].legs.flatMap((leg) => leg.steps);
              setInstrucciones(steps);
              console.log("📦 Instrucciones cargadas:", steps);

              const leg = result.routes[0].legs[0];
              setInfoRuta({
                distancia: leg.distance.text,
                duracion: leg.duration.text,
              });

              const puntos = steps.flatMap((step) =>
                polyline
                  .decode(step.polyline.points)
                  .map(([lat, lng]) => ({ lat, lng }))
              );
              setPuntosGuardados(puntos);

              try {
                const estado = await api.get(`/rutas/estado/${rutaId}`);
                if (estado.data === "INACTIVA") {
                  await iniciarRuta(rutaId, puntos);
                }
                iniciarSimulacion(puntos, rutaId);
              } catch (err) {
                console.error("❌ Error al iniciar ruta:", err);
              }
            }
          );
        }
      })
      .catch((err) => console.error("❌ Error al cargar ruta:", err));
  }, [rutaId, isLoaded]);

  useEffect(() => {
    if (!instrucciones.length || !ubicacion) return;

    let pasoEncontrado = null;

    for (let i = 0; i < instrucciones.length; i++) {
      const step = instrucciones[i];
      const { lat: lat1, lng: lng1 } = ubicacion;

      const lat2 =
        typeof step.end_location.lat === "function"
          ? step.end_location.lat()
          : step.end_location.lat;
      const lng2 =
        typeof step.end_location.lng === "function"
          ? step.end_location.lng()
          : step.end_location.lng;

      const distancia = Math.sqrt(
        Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)
      );

      console.log(`🔍 Paso ${i}: distancia = ${distancia}`);

      if (distancia < 0.001) {
        pasoEncontrado = step;
        console.log("✅ Paso actual encontrado:", step);
        break;
      }
    }

    if (pasoEncontrado) {
      setPasoActual(pasoEncontrado);
    }
  }, [ubicacion, instrucciones]);

  return (
    <>
      {!isLoaded ? (
        <div className="text-center p-4">Cargando mapa...</div>
      ) : !rutaActiva || !ubicacion ? (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Ruta finalizada
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Puedes iniciar una nueva simulación cuando estés listo.
          </p>
          <button
            onClick={() => iniciarSimulacion(puntosGuardados, rutaId)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md"
          >
            Empezar ruta
          </button>
        </div>
      ) : (
        <>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={ubicacion}
            zoom={18}
            options={{
              styles: darkTheme,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMapRef(map)}
          >
            {direcciones && <DirectionsRenderer directions={direcciones} />}
            <Marker
              position={ubicacion}
              icon={{
                url: "/images/truck/truck.png",
                scaledSize: new window.google.maps.Size(60, 60),
                rotation: heading,
                anchor: new window.google.maps.Point(20, 20),
              }}
            />
          </GoogleMap>

          <div className="fixed bottom-10 left-2 bg-gray-100  p-4 rounded-lg shadow-md z-50">
            <p className="text-sm text-gray-600">
              Distancia restante: {infoRuta.distancia}
            </p>
            <p className="text-sm text-gray-600">
              Tiempo estimado: {infoRuta.duracion}
            </p>
          </div>

          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={async () => {
                try {
                  await finalizarRuta(rutaId);
                  detenerSimulacion();
                  reiniciarSimulacion();
                } catch (err) {
                  console.error("❌ Error al finalizar ruta:", err);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-sm font-semibold"
            >
              ✕
            </button>
          </div>

          <Indicaciones pasoActual={pasoActual} />
        </>
      )}
    </>
  );
};

export default MapaRuta;
