import React from "react";

const ModalSeleccionModo = ({ visible, onSeleccionar, onCancelar }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center space-y-6">
        <h2 className="text-xl font-bold text-gray-800">
          ¿Cómo deseas iniciar la ruta?
        </h2>
        <p className="text-gray-600">
          Selecciona el modo de ubicación que deseas usar:
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSeleccionar("simulacion")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full font-semibold"
          >
            Usar simulación
          </button>
          <button
            onClick={() => onSeleccionar("real")}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full font-semibold"
          >
            Usar ubicación real
          </button>
          <button
            onClick={onCancelar}
            className="text-gray-500 hover:text-gray-700 text-sm mt-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSeleccionModo;
