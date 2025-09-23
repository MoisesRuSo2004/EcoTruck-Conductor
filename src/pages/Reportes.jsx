import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";

const ReportesPanel = () => {
  const [reportes, setReportes] = useState([]);

  const opciones = [
    {
      id: 1,
      icono: "🚛",
      titulo: "Problema con Vehículo",
      color: "bg-red-100 text-red-600",
    },
    {
      id: 2,
      icono: "🚦",
      titulo: "Tráfico Pesado",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 3,
      icono: "🗺️",
      titulo: "Problema con Ruta",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 4,
      icono: "👥",
      titulo: "Reclamo de Usuarios",
      color: "bg-purple-100 text-purple-600",
    },
    { id: 5, icono: "❓", titulo: "Otro", color: "bg-gray-100 text-gray-600" },
  ];

  const enviarReporte = (opcion) => {
    const nuevo = {
      id: Date.now(), // ✅ clave única
      icono: opcion.icono,
      titulo: opcion.titulo,
      estado: "Pendiente",
      fecha: new Date().toLocaleString(),
    };
    setReportes([nuevo, ...reportes]);
    alert(`📢 Reporte enviado: ${opcion.titulo}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          📢 Reportes / Incidencias
        </h1>
        <p className="text-gray-600">
          Selecciona una incidencia para enviarla al administrador:
        </p>

        {/* Opciones en Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {opciones.map((op) => (
            <div
              key={op.id}
              onClick={() => enviarReporte(op)}
              className={`cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center text-center bg-white hover:scale-105`}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full text-3xl ${op.color}`}
              >
                {op.icono}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {op.titulo}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Toca para enviar</p>
            </div>
          ))}
        </div>

        {/* Historial */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
            Historial de Reportes
          </h2>
          <div className="space-y-3">
            {reportes.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{r.icono}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{r.titulo}</p>
                    <p className="text-xs text-gray-500">{r.fecha}</p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                  {r.estado}
                </span>
              </div>
            ))}
            {reportes.length === 0 && (
              <p className="text-gray-500 text-sm">
                No has enviado reportes aún.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReportesPanel;
