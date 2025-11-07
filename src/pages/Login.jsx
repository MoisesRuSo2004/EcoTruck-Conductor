import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginAuth } from "../service/authService";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

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
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % frases.length);
        setAnimating(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!correo || !password) return;

    try {
      await LoginAuth(correo, password);
      navigate("/dashboard");
    } catch (error) {
      alert("Credenciales inválidas o error en la conexión");
    }
  };

  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* Fondo móvil difuminado */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          backgroundImage: "url('/images/img/Conductor.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px) brightness(0.55)",
        }}
      ></div>

      <div className="absolute inset-0 lg:hidden bg-gradient-to-b from-black/40 to-black/10"></div>

      {/* Imagen Desktop */}
      <div className="hidden lg:block relative">
        <img
          src="/images/img/Conductor.png"
          className="w-full h-full object-cover"
          alt="Conductor"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent"></div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center px-6 py-10 relative z-10">
        <div className="w-full max-w-lg rounded-2xl p-8 bg-white/40 backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.35)] border border-white/50 animate-fadeInUp">

          {/* Logo con animación */}
          <div className="text-center mb-4 animate-softDrop">
            <img
              src="/images/logo/LogoEcoTruck.svg"
              className="mx-auto h-32 md:h-44 transition-all duration-500 hover:scale-110 hover:rotate-3 hover:drop-shadow-[0_0_18px_rgba(82,255,82,0.45)] floating-logo"
              alt="EcoTruck"
            />
          </div>

          {/* Texto dinámico */}
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Iniciar sesión</h2>
            <div className="h-6 overflow-hidden">
              <p
                className={`text-sm md:text-base text-gray-700 transition-all duration-700 ${
                  animating ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
                }`}
              >
                {frases[index]}
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Correo */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-600" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className={`pl-10 w-full rounded-xl bg-white text-gray-800 placeholder-gray-500 border py-3 outline-none shadow-sm
                  ${submitted && !correo ? "border-red-400" : "border-gray-300 focus:border-green-600"}`}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-600" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 pr-10 w-full rounded-xl bg-white text-gray-800 placeholder-gray-500 border py-3 outline-none shadow-sm
                  ${submitted && !password ? "border-red-400" : "border-gray-300 focus:border-green-600"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full rounded-xl py-3 font-semibold text-white shadow-lg
              bg-gradient-to-r from-green-700 to-lime-600 hover:brightness-110 hover:shadow-[0_0_18px_4px_rgba(82,255,82,0.35)] transition-all"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Animaciones */
<style>
{`
.animate-fadeInUp { animation: fadeInUp 0.8s ease-out; }
.animate-softDrop { animation: softDrop 1s ease-out; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes softDrop {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 🌿 Animación flotante del logo */
.floating-logo {
  animation: floating 4s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
`}
</style>
