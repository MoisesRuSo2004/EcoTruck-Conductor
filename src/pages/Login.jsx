import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginAuth } from "../service/authService";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, rol } = await login(email, password);
      console.log("Login exitoso:", token, rol);

      // Redirigir según rol
      if (rol === "ROLE_CONDUCTOR") {
        navigate("/dashboard-conductor");
      } else {
        navigate("/admin");
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
        <div className="w-full max-w-lg rounded-2xl bg-white/80 backdrop-blur-md shadow-2xl p-6 lg:p-8 space-y-6">
          {/* Logo */}
          <div className="text-center -mt-6">
            <img
              src="/images/logo/logo-dos.svg"
              alt="EcoTruck"
              className="mx-auto h-48 md:h-56 w-auto"
            />
          </div>

          {/* Encabezado */}
          <div className="text-center">
            <h2 className="mt-0 text-2xl lg:text-3xl font-extrabold text-gray-900">
              Inicia sesión
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Bienvenido, conductor 👋
            </p>
          </div>

          {/* Formulario */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full rounded-xl border border-gray-300 bg-white py-2 text-gray-700 placeholder-gray-400 focus:border-[#2b551f] focus:ring-[#2b551f] outline-none shadow-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full rounded-xl border border-gray-300 bg-white py-2 text-gray-700 placeholder-gray-400 focus:border-[#2b551f] focus:ring-[#2b551f] outline-none shadow-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#2b551f] to-[#387228] py-3 text-white font-semibold shadow-md hover:scale-105 transition"
              >
                Iniciar sesión
              </button>
            </div>
          </form>

          {/* Link registro */}
          <div>
            <p className="text-center text-sm text-gray-500">
              ¿No tienes cuenta?{" "}
              <a
                href="#"
                className="font-semibold text-[#2b551f] hover:underline"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
