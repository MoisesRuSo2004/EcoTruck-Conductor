import React, { useEffect } from "react";
import { ArrowRightCircle } from "lucide-react";

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
    <div className="fixed top-[72px] left-1/2 transform -translate-x-1/2 z-50 w-[92%] sm:w-[70%] md:w-[45%]">
      <div className="backdrop-blur-md bg-white/90 border border-gray-200 rounded-2xl shadow-lg px-4 py-3 text-center animate-slide-down">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ArrowRightCircle className="text-ecotruck-primary w-6 h-6 md:w-7 md:h-7" />
          <p
            className="text-sm md:text-base text-gray-800 font-semibold leading-tight"
            dangerouslySetInnerHTML={{ __html: pasoActual.instructions }}
          />
        </div>

        <p className="text-xs text-gray-600 font-medium">
          {pasoActual.distance?.text || "—"} •{" "}
          {pasoActual.duration?.text || "—"}
        </p>
      </div>
    </div>
  );
};

export default Indicaciones;
