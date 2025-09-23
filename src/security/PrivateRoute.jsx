import { Navigate } from "react-router-dom";
import { getToken, isTokenExpired } from "../service/authService";

export default function PrivateRoute({ children }) {
  const token = getToken();

  // Si no hay token o está expirado, redirige al login
  if (!token || isTokenExpired()) {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    return <Navigate to="/" replace />;
  }

  // Si el token es válido, muestra el contenido protegido
  return children;
}
