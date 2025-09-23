import { Bell, CalendarDays, Info, AlertTriangle } from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import { getUserFromToken } from "../utils/getUserFromToken";

const AvisosComunicados = () => {
  const user = getUserFromToken();
  const nombre = user?.nombre || "Conductor";

  // 🔹 Mock data de avisos
  const avisos = [
    {
      id: 1,
      titulo: "Cambio de horario",
      fecha: "2025-09-15T08:00:00",
      tipo: "Urgente",
      descripcion:
        "La ruta Zona Norte iniciará a las 6:00 AM en lugar de las 7:00 AM.",
      icono: <AlertTriangle className="w-6 h-6 text-red-500" />,
      color: "bg-red-100 text-red-700",
    },
    {
      id: 2,
      titulo: "Mantenimiento programado",
      fecha: "2025-09-18T14:00:00",
      tipo: "Informativo",
      descripcion:
        "El camión DEF-456 estará en mantenimiento el próximo lunes.",
      icono: <Info className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: 3,
      titulo: "Nuevo protocolo de seguridad",
      fecha: "2025-09-20T10:00:00",
      tipo: "General",
      descripcion:
        "Es obligatorio el uso de uniforme y casco durante toda la jornada.",
      icono: <Bell className="w-6 h-6 text-green-500" />,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main className="p-6 space-y-6">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Avisos y comunicados
          </h1>
          <p className="text-gray-600">👤 {nombre}</p>
        </div>

        {/* Lista de avisos */}
        {avisos.length === 0 ? (
          <p className="text-gray-500">No tienes avisos por el momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {avisos.map((aviso) => (
              <div
                key={aviso.id}
                className="bg-white shadow-md rounded-2xl p-5 space-y-4"
              >
                {/* Encabezado del aviso */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                    {aviso.icono}
                    <span>{aviso.titulo}</span>
                  </h2>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${aviso.color}`}
                  >
                    {aviso.tipo}
                  </span>
                </div>

                {/* Contenido */}
                <p className="text-sm text-gray-600">{aviso.descripcion}</p>

                {/* Fecha */}
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CalendarDays className="w-5 h-5 text-ecotruck-primary" />
                  <span>
                    {new Date(aviso.fecha).toLocaleDateString()} –{" "}
                    {new Date(aviso.fecha).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AvisosComunicados;
