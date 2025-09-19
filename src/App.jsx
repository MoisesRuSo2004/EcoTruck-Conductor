import { useState } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import IniciarRuta from "./pages/IniciarRuta";
import Login from "./pages/Login";

function App() {
  return (
    <div className="">
      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/iniciarRuta" element={<IniciarRuta />} />
      </Routes>
    </div>
  );
}

export default App;
