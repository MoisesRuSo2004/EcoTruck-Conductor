import React from "react";
import { ArrowRightCircle } from "lucide-react";
import { useEffect } from "react";

const Indicaciones = ({ pasoActual }) => {
  useEffect(() => {
    if (!pasoActual) {
      console.log("🧭 Indicaciones: pasoActual es null");
    } else {
      console.log("🧭 Indicaciones recibidas:", pasoActual);
      console.log("📄 Instrucciones:", pasoActual.instructions);
      console.log("📏 Distancia:", pasoActual.distance?.text);
      console.log("⏱️ Duración:", pasoActual.duration?.text);
    }
  }, [pasoActual]);
  if (!pasoActual) return null;

  return (
    <div className="fixed top-23 left-1/2 transform -translate-x-1/2 bg-gray-100 px-4 py-3 rounded-lg shadow-lg z-50 text-center  w-full animate-slide-up">
      <div className="flex items-center justify-center gap-2 mb-1">
        <ArrowRightCircle className="text-ecotruck-primary size-8" />
        <p
          className="text-s text-gray-700 font-semibold"
          dangerouslySetInnerHTML={{ __html: pasoActual.instructions }}
        />
      </div>
      <p className="text-xs text-gray-500">
        {pasoActual.distance.text} • {pasoActual.duration.text}
      </p>
    </div>
  );
};

export default Indicaciones;
