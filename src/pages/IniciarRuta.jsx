import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import MapaRuta from "../components/mapa/MapaRuta";
import api from "../service/api";
import toast from "react-hot-toast";

const IniciarRuta = () => {
  const [rutaIniciada, setRutaIniciada] = useState(false);
  const [rutaId, setRutaId] = useState(null);
  const [loadingRuta, setLoadingRuta] = useState(true);
  const [activandoRuta, setActivandoRuta] = useState(false);

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
        toast.error("No se pudo cargar la ruta asignada");
      })
      .finally(() => {
        setLoadingRuta(false);
      });
  }, []);

  const handleIniciarRuta = async () => {
    if (!rutaId) {
      console.warn("⚠️ No hay rutaId disponible para iniciar");
      toast.error("No hay ruta asignada para iniciar");
      return;
    }

    const puntosInterpolados = [
      { lat: 10.4, lng: -75.5 },
      { lat: 10.5, lng: -75.6 },
    ]; // ⚠️ Reemplaza con puntos reales si ya los tienes

    console.log("🛰️ Enviando solicitud para iniciar ruta con ID:", rutaId);
    setActivandoRuta(true);

    try {
      const response = await api.post(`/rutas/iniciar/${rutaId}`, {
        puntosInterpolados,
      });

      console.log("✅ Respuesta del backend:", response);
      toast.success("Ruta iniciada correctamente");
      setRutaIniciada(true);
    } catch (err) {
      console.error("❌ Error al iniciar ruta:", err);
      console.log("📦 Detalles del error:", {
        status: err.response?.status,
        data: err.response?.data,
        rutaId,
      });

      if (err.response?.status === 400) {
        toast.error(
          "⚠️ La ruta no se pudo iniciar. Verifica los puntos enviados."
        );
      } else if (err.response?.status === 401) {
        toast.error("🚫 No tienes permisos para iniciar esta ruta.");
      } else {
        toast.error("❌ Error inesperado al iniciar la ruta.");
      }
    } finally {
      setActivandoRuta(false);
    }
  };

  const puedeIniciar = rutaId && !loadingRuta && !activandoRuta;

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main className="flex flex-col items-center justify-center p-0">
        {!rutaIniciada ? (
          <div className="text-center space-y-6 mt-30">
            <MapPin className="mx-auto text-ecotruck-primary size-15 animate-bounce" />
            <h1 className="text-2xl font-bold text-gray-800">
              ¿Listo para comenzar tu ruta?
            </h1>
            <button
              onClick={handleIniciarRuta}
              disabled={!puedeIniciar}
              className={`px-8 py-3 rounded-full text-lg font-semibold shadow-md animate-pulse ${
                puedeIniciar
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            >
              {loadingRuta
                ? "Cargando ruta..."
                : activandoRuta
                ? "Activando..."
                : "Empezar"}
            </button>
          </div>
        ) : (
          <div className="w-full h-[85vh] mt-0">
            <MapaRuta rutaId={rutaId} />
          </div>
        )}
      </main>
    </div>
  );
};

export default IniciarRuta;
