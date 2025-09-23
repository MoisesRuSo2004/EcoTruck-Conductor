import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import { getRutaConDirecciones } from "../../service/directionsService";
import { getDistanciaYTiempo } from "../../service/distanceService";
import { useEffect, useState } from "react";
import { getRutaById } from "../../service/rutaService";
import polyline from "@mapbox/polyline";
import Indicaciones from "../indicaciones/Indicaciones";

const MapaRuta = ({ rutaId }) => {
  const [mapRef, setMapRef] = useState(null);
  const [puntosInterpolados, setPuntosInterpolados] = useState([]);
  const [ubicacion, setUbicacion] = useState(null);
  const [direcciones, setDirecciones] = useState(null);
  const [infoRuta, setInfoRuta] = useState({ distancia: "", duracion: "" });
  const [instrucciones, setInstrucciones] = useState([]);
  const [pasoActual, setPasoActual] = useState(null);
  const [heading, setHeading] = useState(0); // dirección del camión

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
            (result, status) => {
              if (status === "OK") {
                setDirecciones(result);

                const steps = result.routes[0].legs.flatMap((leg) => leg.steps);
                setInstrucciones(steps);

                const puntos = steps.flatMap((step) =>
                  polyline
                    .decode(step.polyline.points)
                    .map(([lat, lng]) => ({ lat, lng }))
                );

                setPuntosInterpolados(puntos);
                setUbicacion(puntos[0]);
              } else {
                console.error("Error en Directions API:", status);
              }
            }
          );
        } else {
          console.warn("⚠️ La ruta no tiene suficientes puntos.");
        }
      })
      .catch((err) => console.error("Error al cargar ruta:", err));
  }, [rutaId, isLoaded]);

  // Simulación de movimiento fluido + dirección
  useEffect(() => {
    if (puntosInterpolados.length === 0) return;

    let i = 0;
    const intervalo = setInterval(() => {
      if (i < puntosInterpolados.length) {
        const actual = puntosInterpolados[i];
        const siguiente = puntosInterpolados[i + 1];

        setUbicacion(actual);

        if (siguiente) {
          const deltaLat = siguiente.lat - actual.lat;
          const deltaLng = siguiente.lng - actual.lng;
          const angulo = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);
          const normalizado = (angulo + 360) % 360;
          setHeading((normalizado + 90) % 360); // ✅ compensar 90° si el ícono apunta al este
        }

        i++;
      } else {
        clearInterval(intervalo);
      }
    }, 500);

    return () => clearInterval(intervalo);
  }, [puntosInterpolados]);

  // Actualizar distancia y duración restante
  useEffect(() => {
    if (ubicacion && puntosInterpolados.length > 0) {
      const destino = puntosInterpolados[puntosInterpolados.length - 1];
      getDistanciaYTiempo(ubicacion, destino)
        .then((info) => setInfoRuta(info))
        .catch((err) => console.error("Error en Distance Matrix:", err));
    }
  }, [ubicacion]);

  // Detectar paso actual
  useEffect(() => {
    if (!ubicacion || instrucciones.length === 0) return;

    const paso = instrucciones.find((step) => {
      const [lat, lng] = polyline.decode(step.polyline.points)[0];
      const distancia = Math.sqrt(
        Math.pow(lat - ubicacion.lat, 2) + Math.pow(lng - ubicacion.lng, 2)
      );
      return distancia < 0.001;
    });

    if (paso) setPasoActual(paso);
  }, [ubicacion, instrucciones]);

  useEffect(() => {
    if (mapRef && ubicacion) {
      mapRef.panTo(ubicacion);
      mapRef.setZoom(17);
      mapRef.setHeading(heading);
      mapRef.setTilt(45);
    }
  }, [mapRef, ubicacion, heading]);

  if (!isLoaded) return <div className="text-center p-4">Cargando mapa...</div>;
  if (!rutaId || !ubicacion || puntosInterpolados.length === 0)
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Sin ruta asignada
        </h2>
        <p className="text-sm text-gray-500">
          Este conductor no tiene una ruta activa en este momento. Cuando se
          asigne una, aparecerá aquí la navegación.
        </p>
      </div>
    );

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={ubicacion}
        zoom={18}
        options={{
          styles: darkTheme,
          tilt: 45,
          heading: heading,
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
            rotation: heading, // 👈 dirección dinámica
            anchor: new window.google.maps.Point(20, 20),
          }}
        />
      </GoogleMap>
      {/* Tarjeta flotante con info de navegación */}
      <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-md z-50">
        <p className="text-sm text-gray-600">
          Distancia restante: {infoRuta.distancia}
        </p>
        <p className="text-sm text-gray-600">
          Tiempo estimado: {infoRuta.duracion}
        </p>
      </div>
      {/* Indicaciones paso a paso */}
      <Indicaciones pasoActual={pasoActual} />
    </>
  );
};

export default MapaRuta;
