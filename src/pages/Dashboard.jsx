import { useEffect, useState } from "react";
import { Truck, Clock, Timer, CalendarClock } from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import api from "../service/api";
import { getUserFromToken } from "../utils/getUserFromToken";
import { useUbicacionReal } from "../hook/useUbicacionReal";


const Dashboard = () => {
  const [asignacion, setAsignacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [horaLlegada, setHoraLlegada] = useState("");
  const [tiempoRecorrido, setTiempoRecorrido] = useState("");
  const [tiempoRestante, setTiempoRestante] = useState("");
  const [progress, setProgress] = useState(0);

  const user = getUserFromToken();
  const nombre = user?.nombre || "Conductor";

  useEffect(() => {
    api
      .get("/asignaciones/conductor")
      .then((res) => {
        if (res.data === null) {
          setAsignacion(null);
        } else {
          setAsignacion(res.data);

          const salida = new Date(res.data.fechaAsignacion);
          const ahora = new Date();
          const llegadaEstimada = new Date(
            salida.getTime() + 4 * 60 * 60 * 1000
          ); // +4h

          const recorridoMs = ahora - salida;
          const restanteMs = llegadaEstimada - ahora;

          setHoraLlegada(
            llegadaEstimada.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          );
          setTiempoRecorrido(msToTime(recorridoMs));
          setTiempoRestante(msToTime(restanteMs));

          const progreso = Math.min(
            100,
            Math.floor((recorridoMs / (4 * 60 * 60 * 1000)) * 100)
          );
          setProgress(progreso);
        }
      })
      .catch((err) => {
        console.error("Error al cargar asignación:", err);
        setAsignacion(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const msToTime = (ms) => {
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}h ${m}min`;
  };

  if (loading) return <p className="p-6">Cargando datos del conductor...</p>;

  if (!asignacion) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        <Navbar />
        <main className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">
            ¡Bienvenido, {nombre}!
          </h1>

          <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Sin asignación activa
            </h2>
            <p className="text-sm text-gray-500">
              Actualmente no tienes una ruta asignada. Cuando se te asigne una,
              aparecerá aquí tu recorrido y progreso.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main className="p-6 space-y-6">
        {/* Título principal */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            ¡Bienvenido, {nombre}!
          </h1>

          {/* Camión asignado */}
          <div className="bg-white shadow rounded-md px-4 py-2 text-right">
            <p className="text-xs text-gray-500">Camión asignado</p>
            <p className="text-lg font-semibold text-ecotruck-primary">
              {asignacion.placaCamion}
            </p>
          </div>
        </div>

        {/* Sección Ruta + barra de progreso */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Ruta: {asignacion.nombreRuta}
          </h2>
          <div className="relative w-full bg-gray-300 rounded-full h-5 overflow-hidden">
            <div
              className="bg-[#7BB369] h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
            <div
              className="absolute top-2/2 -translate-y-1/2 transition-all duration-500"
              style={{
                left: `${progress}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Truck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {progress}% del recorrido completado
          </p>
        </section>

        {/* Tarjetas informativas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
            <Clock className="w-8 h-8 text-ecotruck-primary" />
            <div>
              <p className="text-sm text-gray-500">Hora de salida</p>
              <p className="text-xl font-bold text-gray-800">
                {new Date(asignacion.fechaAsignacion).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
            <CalendarClock className="w-8 h-8 text-ecotruck-primary" />
            <div>
              <p className="text-sm text-gray-500">Hora estimada de llegada</p>
              <p className="text-xl font-bold text-gray-800">{horaLlegada}</p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
            <Timer className="w-8 h-8 text-ecotruck-primary" />
            <div>
              <p className="text-sm text-gray-500">Tiempo recorrido</p>
              <p className="text-xl font-bold text-gray-800">
                {tiempoRecorrido}
              </p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
            <Timer className="w-8 h-8 text-ecotruck-primary" />
            <div>
              <p className="text-sm text-gray-500">Tiempo restante</p>
              <p className="text-xl font-bold text-gray-800">
                {tiempoRestante}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
