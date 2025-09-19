import { useState } from "react";
import { MapPin } from "lucide-react"; // opcional para ícono decorativo
import Navbar from "../components/navbar/Navbar";
import MapaRuta from "../components/mapa/MapaRuta"; // componente que simula el mapa

const IniciarRuta = () => {
  const [rutaIniciada, setRutaIniciada] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-6">
        {!rutaIniciada ? (
          <div className="text-center space-y-6 mt-30">
            <MapPin className="mx-auto text-ecotruck-primary size-15 animate-bounce" />
            <h1 className="text-2xl font-bold text-gray-800">
              ¿Listo para comenzar tu ruta?
            </h1>
            <button
              onClick={() => setRutaIniciada(true)}
              className="bg-ecotruck-primary text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md bg-green-600 hover:bg-green-700  animate-pulse"
            >
              Empezar
            </button>
          </div>
        ) : (
          <div className="w-full h-[80vh] mt-0">
            <MapaRuta />
          </div>
        )}
      </main>
    </div>
  );
};

export default IniciarRuta;
