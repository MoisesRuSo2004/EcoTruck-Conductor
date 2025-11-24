window.global = window;
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { SimulacionProvider } from "./context/SimulacionContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SimulacionProvider>
        <App />
      </SimulacionProvider>
    </BrowserRouter>
  </StrictMode>
);
