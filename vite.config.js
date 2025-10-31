import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    open: true, // Abre el navegador en desarrollo (opcional)
  },
  build: {
    outDir: "dist", // Carpeta que Azure debe servir
    sourcemap: false, // Puedes activarlo si necesitas debug en producción
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Importaciones absolutas
    },
  },
  define: {
    "process.env": {}, // Evita errores con librerías que esperan process.env
  },
});
