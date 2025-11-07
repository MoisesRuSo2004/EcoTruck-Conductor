import { useState } from "react";

export default function FormularioGenerico({ titulo, onClose, onSubmit }) {
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ descripcion });
    onClose();
  };

  return (
    <>
      {/* Fondo difuminado */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose}></div>

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 p-6 max-h-[75vh] overflow-y-auto animate-[slideUp_0.28s_ease]">

        {/* Handle superior */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 rounded-full bg-gray-300"></div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          📢 Reporte: {titulo}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-gray-700 font-medium block mb-1">
              Describe brevemente lo sucedido
            </label>
            <textarea
              className="input h-32 resize-none"
              placeholder="Ejemplo: Se presentó demora por obra vial..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Enviar Reporte
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .input {
            width: 100%;
            padding: 0.55rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            outline: none;
          }
          .input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 1px #3b82f6;
          }
        `}
      </style>
    </>
  );
}
