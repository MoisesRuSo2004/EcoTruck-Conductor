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
      return;
    }

    console.log("🛰️ Enviando solicitud para iniciar ruta con ID:", rutaId);
    setActivandoRuta(true);

    try {
      const response = await api.post(`/rutas/iniciar/${rutaId}`);
      console.log("✅ Respuesta del backend:", response);
      toast.success("Ruta iniciada correctamente");
      setRutaIniciada(true);
    } catch (err) {
      console.error("❌ Error al iniciar ruta:", err);
      console.error("📦 Detalles del error:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        rutaId,
      });
      toast.error("La ruta ya está activa o hubo un error");
    } finally {
      setActivandoRuta(false);
    }
  };

  const puedeIniciar = rutaId && !loadingRuta && !activandoRuta;

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
          <div className="w-full h-[80vh] mt-0">
            <MapaRuta rutaId={rutaId} />
          </div>
        )}
      </main>
    </div>
  );
};

export default IniciarRuta;
