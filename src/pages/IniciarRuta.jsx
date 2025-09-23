import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import MapaRuta from "../components/mapa/MapaRuta";
import api from "../service/api";

const IniciarRuta = () => {
  const [rutaIniciada, setRutaIniciada] = useState(false);
  const [rutaId, setRutaId] = useState(null);
  const [loadingRuta, setLoadingRuta] = useState(true);

  useEffect(() => {
    api
      .get("/asignaciones/conductor")
      .then((res) => {
        console.log("→ Asignación recibida:", res.data);
        const id = res.data?.rutaId;
        if (id) {
          setRutaId(id);
        }
      })
      .catch((err) => {
        console.error("Error al obtener asignación:", err);
      })
      .finally(() => {
        setLoadingRuta(false);
      });
  }, []);

  const puedeIniciar = rutaId && !loadingRuta;

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
              disabled={!puedeIniciar}
              className={`px-8 py-3 rounded-full text-lg font-semibold shadow-md animate-pulse ${
                puedeIniciar
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              {loadingRuta ? "Cargando ruta..." : "Empezar"}
            </button>
          </div>
        ) : (
          <div className="w-full h-[80vh] mt-0">
            <MapaRuta rutaId={rutaId} />
          </div>
        )}
      </main>
    </div>
  );
};

export default IniciarRuta;
