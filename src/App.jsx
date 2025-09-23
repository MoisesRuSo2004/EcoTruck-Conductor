import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IniciarRuta from "./pages/IniciarRuta";
import Login from "./pages/Login";
import PrivateRoute from "./security/PrivateRoute"; // ajusta la ruta según tu estructura
import HistorialRutas from "./pages/HistorialRutas";
import AvisosComunicados from "./pages/Comunicados";
import ReportesPanel from "./pages/Reportes";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/iniciarRuta"
          element={
            <PrivateRoute>
              <IniciarRuta />
            </PrivateRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <PrivateRoute>
              <HistorialRutas />
            </PrivateRoute>
          }
        />
        <Route
          path="/comunicados"
          element={
            <PrivateRoute>
              <AvisosComunicados />
            </PrivateRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <PrivateRoute>
              <ReportesPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
