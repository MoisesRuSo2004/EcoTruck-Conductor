import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginAuth } from "../service/authService"; // ✅ si el archivo está ahí
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ estado para ver/ocultar
  const navigate = useNavigate();

  // 🔹 Frases dinámicas
  const frases = [
    "Listo para la ruta. Inicia sesión y ponte en marcha!",
    "Tu dashboard de conductor te espera. ¡Comienza a conducir!",
    "Optimiza tu jornada. Accede a tu cuenta y arranca!",
    "Conduce con confianza. Tu próxima ruta está lista para ti",
  ];
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true); // activa animación de salida
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % frases.length);
        setAnimating(false); // vuelve a entrar
      }, 500); // tiempo de salida
    }, 5000); // cambia cada 5 segundos
    return () => clearInterval(interval);
  }, [frases.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, rol } = await LoginAuth(correo, password);
      console.log("Login exitoso:", token, rol);

      // Redirigir según rol
      if (rol === "CONDUCTOR") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Credenciales inválidas o error de conexión");
    }
  };

  return (
    <div className="h-screen overflow-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* Columna izquierda */}
      <div className="hidden lg:block">
        <div className="h-screen bg-gradient-to-br from-[#2b551f] to-[#387228] overflow-hidden">
          <img
            src="/images/img/Conductor.png"
            alt="Conductor EcoTruck"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Columna derecha */}
      <div className="flex items-start justify-center bg-[#f9fafb] h-full py-8 lg:py-12">
        <div className="w-full max-w-lg rounded-2xl bg-white/80 backdrop-blur-md shadow-2xl px-6 pb-6 pt-2 lg:px-8 lg:pb-8 lg:pt-4 space-y-6">
          {/* Logo */}
          <div className="text-center ">
            <img
              src="/images/logo/logo-dos.svg"
              alt="EcoTruck"
              className="mx-auto h-48 md:h-56 w-auto -mb-16"
            />
          </div>

          {/* Encabezado con frases dinámicas */}
          <div className="text-center  space-y-1">
            <h2 className="text-xl lg:text-3xl font-extrabold text-gray-900">
              Iniciar sesión
            </h2>

            <div className="h-6 overflow-hidden relative">
              <p
                className={`text-base text-gray-600 font-medium transition-transform duration-800 ease-in-out ${
                  animating
                    ? "translate-y-6 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                {frases[index]}
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Correo */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="correo"
                name="correo"
                type="email"
                required
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="pl-10 w-full rounded-xl border border-gray-300 bg-white py-2 text-gray-700 placeholder-gray-400 focus:border-[#2b551f] focus:ring-[#2b551f] outline-none shadow-sm"
              />
            </div>

            {/* Contraseña con ojito */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 w-full rounded-xl border border-gray-300 bg-white py-2 text-gray-700 placeholder-gray-400 focus:border-[#2b551f] focus:ring-[#2b551f] outline-none shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Botón */}
            <div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#2b551f] to-[#387228] py-3 text-white font-semibold shadow-md hover:scale-105 transition"
              >
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
