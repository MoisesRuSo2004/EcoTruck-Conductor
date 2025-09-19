import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const MapaRuta = () => {
  const [mapRef, setMapRef] = useState(null);
  const [ubicacion, setUbicacion] = useState({ lat: 10.4, lng: -75.5 });

  const puntos = [
    { lat: 10.4, lng: -75.5 },
    { lat: 10.41, lng: -75.51 },
    { lat: 10.42, lng: -75.52 },
    { lat: 10.43, lng: -75.53 },
  ];

  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  };

  const darkTheme = [
    {
      elementType: "geometry",
      stylers: [{ color: "#1d1d1d" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#a3a3a3" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1d1d1d" }],
    },
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
    if (mapRef) {
      mapRef.panTo(ubicacion);
      mapRef.setZoom(17);
    }
  }, [mapRef]);

  if (!isLoaded) return <div className="text-center p-4">Cargando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={ubicacion}
      zoom={8}
      options={{
        styles: darkTheme,
        tilt: 45,
        heading: 90,
        mapTypeControl: false,
      }}
      onLoad={(map) => setMapRef(map)}
    >
      <Polyline
        path={puntos}
        options={{
          strokeColor: "#22C55E",
          strokeOpacity: 0.8,
          strokeWeight: 5,
        }}
      />

      {puntos.map((p, i) => (
        <Marker key={i} position={p} />
      ))}

      {/* Flecha tipo Waze */}
      <Marker
        position={ubicacion}
        icon={{
          path: "M0,-20 L10,0 L0,20 L-10,0 Z",
          fillColor: "#22C55E",
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 1.5,
          rotation: 90,
          anchor: { x: 0, y: 0 },
        }}
      />
    </GoogleMap>
  );
};

export default MapaRuta;
