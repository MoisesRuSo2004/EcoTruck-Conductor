import React from "react";

const Indicaciones = ({ pasoActual }) => {
  if (!pasoActual) return null;

  return (
    <div className="fixed top-130 left-42 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md z-50 text-center max-w-md">
      <p
        className="text-sm text-gray-700 font-semibold"
        dangerouslySetInnerHTML={{ __html: pasoActual.instructions }}
      />
      <p className="text-xs text-gray-500">
        {pasoActual.distance.text} • {pasoActual.duration.text}
      </p>
    </div>
  );
};

export default Indicaciones;
