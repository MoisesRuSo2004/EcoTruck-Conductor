import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import polyline from "@mapbox/polyline";
import {
  getRutaById,
  iniciarRuta,
  finalizarRuta,
} from "../../service/rutaService";
import { useSimulacion } from "../../context/SimulacionContext";
import api from "../../service/api";
import Indicaciones from "../indicaciones/Indicaciones";
import { useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW9pc2VzcnVzbyIsImEiOiJjbWdjeDd5MHYweTFpMnFwa3U0ZGJpdnNmIn0.PX6LRJ0pDT8APzemLMnpog";

const MapaConductor = ({ rutaId, ubicacion, heading }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [infoRuta, setInfoRuta] = useState({ distancia: "", duracion: "" });
  const [instrucciones, setInstrucciones] = useState([]);
  const [pasoActual, setPasoActual] = useState(null);
  const [puntosGuardados, setPuntosGuardados] = useState([]);
  const navigate = useNavigate();

  const {
    rutaActiva,
    iniciarSimulacion,
    detenerSimulacion,
    reiniciarSimulacion,
  } = useSimulacion();

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

              const steps = result.routes[0].legs.flatMap((leg) => leg.steps);
              setInstrucciones(steps);

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

              if (!mapRef.current && mapContainerRef.current) {
                mapRef.current = new mapboxgl.Map({
                  container: mapContainerRef.current,
                  style: "mapbox://styles/mapbox/navigation-night-v1",
                  center: [puntos[0].lng, puntos[0].lat],
                  zoom: 17,
                  pitch: 75, // vista más de frente
                  bearing: heading || 0, // 👈 Orientación
                  attributionControl: false,
                });

                mapRef.current.addControl(new mapboxgl.NavigationControl());
                mapRef.current.dragRotate.disable();
                mapRef.current.touchZoomRotate.disableRotation();

                mapRef.current.on("load", () => {
                  mapRef.current.addSource("ruta", {
                    type: "geojson",
                    data: {
                      type: "Feature",
                      geometry: {
                        type: "LineString",
                        coordinates: puntos.map((p) => [p.lng, p.lat]),
                      },
                    },
                  });

                  mapRef.current.addLayer({
                    id: "ruta",
                    type: "line",
                    source: "ruta",
                    layout: {
                      "line-join": "round",
                      "line-cap": "round",
                    },
                    paint: {
                      "line-color": "#00bfff",
                      "line-width": 6,
                    },
                  });

                  // 🔵 Flecha sobria y sin brillo excesivo
                  const el = document.createElement("div");
                  el.className = "nav-arrow";
                  el.innerHTML = `
                <svg width="80" height="80" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 8 L40 28 H36 L32 18 L28 28 H24 L32 8 Z"
                    fill="url(#gradArrow)" stroke="#1d77cc" stroke-width="1.2" stroke-linejoin="round"/>
                    <defs>
                    <linearGradient id="gradArrow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#3a9ee0"/>
                        <stop offset="100%" stop-color="#005fa3"/>
                    </linearGradient>
                    </defs>
                </svg>
                `;

                  markerRef.current = new mapboxgl.Marker(el)
                    .setLngLat([puntos[0].lng, puntos[0].lat])
                    .addTo(mapRef.current);
                });
              }

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

  // 🔄 Movimiento de cámara realista (tipo navegación)
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !ubicacion) return;

    markerRef.current.setLngLat([ubicacion.lng, ubicacion.lat]);

    const cameraOffset = 0.00005; // pequeño desplazamiento hacia adelante
    const rad = (Math.PI / 180) * heading;
    const offsetLat = ubicacion.lat + cameraOffset * Math.cos(rad);
    const offsetLng = ubicacion.lng + cameraOffset * Math.sin(rad);

    mapRef.current.easeTo({
      center: [offsetLng, offsetLat], // mira hacia el frente del vehículo
      bearing: heading + 280,
      pitch: 75,
      zoom: 19,
      duration: 800,
      easing: (t) => t,
    });
  }, [ubicacion, heading]);

  // 📍 Detectar paso actual
  useEffect(() => {
    if (!instrucciones.length || !ubicacion) return;

    let pasoEncontrado = null;
    for (let i = 0; i < instrucciones.length; i++) {
      const step = instrucciones[i];
      const lat2 =
        typeof step.end_location.lat === "function"
          ? step.end_location.lat()
          : step.end_location.lat;
      const lng2 =
        typeof step.end_location.lng === "function"
          ? step.end_location.lng()
          : step.end_location.lng;

      const distancia = Math.sqrt(
        Math.pow(ubicacion.lat - lat2, 2) + Math.pow(ubicacion.lng - lng2, 2)
      );
      if (distancia < 0.001) {
        pasoEncontrado = step;
        break;
      }
    }

    if (pasoEncontrado) setPasoActual(pasoEncontrado);
  }, [ubicacion, instrucciones]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-lg shadow-md"
        style={{ minHeight: "400px" }}
      />

      <div className="fixed bottom-10 left-2 bg-gray-100 p-4 rounded-lg shadow-md z-50">
        <p className="text-sm text-gray-600">
          Distancia restante: {infoRuta.distancia || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          Tiempo estimado: {infoRuta.duracion || "N/A"}
        </p>
      </div>

      {rutaActiva && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={async () => {
              try {
                await finalizarRuta(rutaId);
                detenerSimulacion();
                reiniciarSimulacion();
              } catch (err) {
                console.error("❌ Error al finalizar ruta:", err);
              } finally {
                navigate("/iniciarRuta", { replace: true }); // 👈 fuerza navegación
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-sm font-semibold"
          >
            ✕
          </button>
        </div>
      )}

      <Indicaciones pasoActual={pasoActual} />
    </div>
  );
};

export default MapaConductor;
