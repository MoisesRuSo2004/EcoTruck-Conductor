import { Route, CalendarDays, Clock4, Truck } from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import { getUserFromToken } from "../utils/getUserFromToken";

const HistorialRutas = () => {
  const user = getUserFromToken();
  const nombre = user?.nombre || "Conductor";

  // 🔹 Datos simulados de historial
  const historial = [
    {
      id: 1,
      nombreRuta: "Zona Norte",
      fecha: "2025-09-10T08:00:00",
      tiempoRecorrido: "3h 45min",
      placaCamion: "ABC-123",
      kilometros: 25,
    },
    {
      id: 2,
      nombreRuta: "Zona Centro",
      fecha: "2025-09-12T14:00:00",
      tiempoRecorrido: "4h 10min",
      placaCamion: "DEF-456",
      kilometros: 30,
    },
    {
      id: 3,
      nombreRuta: "Zona Sur",
      fecha: "2025-09-15T07:30:00",
      tiempoRecorrido: "3h 20min",
      placaCamion: "GHI-789",
      kilometros: 22,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main className="p-6 space-y-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Historial de rutas
          </h1>
          <p className="text-gray-600">👤 {nombre}</p>
        </div>

        {/* Lista de rutas */}
        {historial.length === 0 ? (
          <p className="text-gray-500">No tienes rutas completadas.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {historial.map((ruta) => (
              <div
                key={ruta.id}
                className="bg-white shadow-md rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    <Route className="w-6 h-6 text-ecotruck-primary" />
                    <span>{ruta.nombreRuta}</span>
                  </h2>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Completada
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="w-5 h-5 text-ecotruck-primary" />
                    <span>{new Date(ruta.fecha).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock4 className="w-5 h-5 text-ecotruck-primary" />
                    <span>Duración: {ruta.tiempoRecorrido}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-ecotruck-primary" />
                    <span>Camión: {ruta.placaCamion}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Route className="w-5 h-5 text-ecotruck-primary" />
                    <span>KMs: {ruta.kilometros} km</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistorialRutas;
