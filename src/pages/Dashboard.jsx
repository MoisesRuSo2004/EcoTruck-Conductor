import Navbar from "../components/navbar/Navbar";
import { Truck, Clock, Timer, CalendarClock } from "lucide-react";

const Dashboard = () => {
  const progress = 65; // Progreso actual

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main className="p-6 space-y-6">
        {/* Título principal */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            ¡Bienvenido, CARLOS!
          </h1>

          {/* KM del camión */}
          <div className="bg-white shadow rounded-md px-4 py-2 text-right">
            <p className="text-xs text-gray-500">Kilometraje actual</p>
            <p className="text-lg font-semibold text-ecotruck-primary">
              12,340 km
            </p>
          </div>
        </div>

        {/* Sección Ruta + barra de progreso */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ruta</h2>
          <div className="relative w-full bg-gray-300 rounded-full h-5 overflow-hidden">
            {/* Barra de progreso */}
            <div
              className="bg-[#7BB369] h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>

            {/* Camioncito en el progreso */}
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
          {/* Hora de salida */}
          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
            <Clock className="w-8 h-8 text-ecotruck-primary" />
            <div>
              <p className="text-sm text-gray-500">Hora de salida</p>
              <p className="text-xl font-bold text-gray-800">06:30 AM</p>
            </div>
          </div>

          {/* Hora estimada de llegada */}
          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
            <CalendarClock className="w-8 h-8 text-ecotruck-primary" />
            <div>
              <p className="text-sm text-gray-500">Hora estimada de llegada</p>
              <p className="text-xl font-bold text-gray-800">10:15 AM</p>
            </div>
          </div>

          {/* Tiempo recorrido */}
          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
            <Timer className="w-8 h-8 text-ecotruck-primary" />
            <div>
              <p className="text-sm text-gray-500">Tiempo recorrido</p>
              <p className="text-xl font-bold text-gray-800">2h 45min</p>
            </div>
          </div>

          {/* Tiempo restante (reemplazo de puntos recolectados) */}
          <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
            <Timer className="w-8 h-8 text-ecotruck-primary" />
            <div>
              <p className="text-sm text-gray-500">Tiempo restante</p>
              <p className="text-xl font-bold text-gray-800">1h 30min</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
