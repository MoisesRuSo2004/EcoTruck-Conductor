import { useState } from "react";
import { enviarPrediccionDesdeConductor } from "../../service/prediccionService";

export default function FormularioVehiculo({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    kilometraje: "",
    frecuencia_ruta: "",
    carga_promedio: "",
    hubo_fallo: false,
    tipo_fallo: "",
    condicion_via: "",
    zona: "",
    mes: "",
    dia_semana: "",
  });

  const zonas = [
    "Zona 1",
    "Zona 2",
    "Zona 3",
    "Zona 4",
    "Zona 5",
    "Zona 6",
    "Zona 7",
    "Zona 8",
    "Zona 9",
    "Zona 10",
    "Zona 11",
    "Zona 12",
  ];

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    // 🔥 Si el input es tipo number, evitamos letras
    if (type === "number" && /[^0-9]/.test(value)) return;

    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const normalizarDatos = (form) => {
    return {
      ...form,
      zona: form.zona.replace(" ", ""), // "Zona 1" → "Zona1"
      dia_semana: traducirDia(form.dia_semana), // "Lunes" → "Monday"
    };
  };

  const traducirDia = (dia) => {
    const mapa = {
      Lunes: "Monday",
      Martes: "Tuesday",
      Miércoles: "Wednesday",
      Jueves: "Thursday",
      Viernes: "Friday",
      Sábado: "Saturday",
      Domingo: "Sunday",
    };
    return mapa[dia] || dia;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datos = normalizarDatos(form);
      const resultado = await enviarPrediccionDesdeConductor(datos);
      console.log("✅ Predicción generada:", resultado);
      onSubmit(form); // opcional para historial local
      onClose();
    } catch (err) {
      console.error("❌ Error al enviar predicción:", err);
    }
  };

  return (
    <>
      {/* Fondo Blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 p-6 max-h-[85vh] overflow-y-auto animate-[slideUp_0.28s_ease]">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1.5 rounded-full bg-gray-300"></div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
          Reportar Problema con el Vehículo
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Kilometraje actual</label>
            <input
              type="number"
              name="kilometraje"
              className="input"
              placeholder="Ej: 85400"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Frecuencia de ruta (por semana)</label>
            <input
              type="number"
              name="frecuencia_ruta"
              className="input"
              placeholder="Ej: 5"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Carga promedio transportada (kg)</label>
            <input
              type="number"
              name="carga_promedio"
              className="input"
              placeholder="Ej: 950"
              onChange={handleChange}
              required
            />
          </div>

          <label className="flex items-center gap-2 text-gray-700">
            <input type="checkbox" name="hubo_fallo" onChange={handleChange} />
            ¿Hubo fallo durante la ruta?
          </label>

          <div>
            <label className="label">Tipo de fallo (si lo hubo)</label>
            <select
              name="tipo_fallo"
              value={form.tipo_fallo}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Electrico">Eléctrico</option>
              <option value="Mecanico">Mecánico</option>
              <option value="Neumatico">Neumático</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="label">Condición de la vía</label>
            <select
              name="condicion_via"
              className="input"
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar</option>
              <option>Buena</option>
              <option>Regular</option>
              <option>Mala</option>
            </select>
          </div>

          <div>
            <label className="label">Zona</label>
            <select
              name="zona"
              className="input"
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar</option>
              {zonas.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Mes</label>
            <input
              type="number"
              min="1"
              max="12"
              name="mes"
              className="input"
              placeholder="1 - 12"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Día de la semana</label>
            <select
              name="dia_semana"
              className="input"
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar</option>
              {diasSemana.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>

            <button type="submit" className="btn-submit">
              Enviar Reporte
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

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

          .label { display:block; font-size:0.875rem; font-weight:500; color:#374151; margin-bottom:4px;}

          .btn-cancel { flex:1; padding:0.5rem; border:1px solid #d1d5db; border-radius:0.5rem; }
          .btn-cancel:hover { background:#f3f4f6; }

          .btn-submit { flex:1; padding:0.5rem; background:#059669; color:white; border-radius:0.5rem; }
          .btn-submit:hover { background:#047857; }
        `}
      </style>
    </>
  );
}
