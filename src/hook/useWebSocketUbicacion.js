import { useEffect, useRef } from "react";
import SockJS from "sockjs-client/dist/sockjs"; // ✅ importante: usar la versión compilada para navegador
import { over } from "stompjs";

export function useWebSocketUbicacion({ camionId, ubicacion, activo }) {
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!activo) return;

    console.log("🔌 Conectando al WebSocket...");
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({}, () => {
      console.log("✅ Conectado al servidor WebSocket");

      // Escucha mensajes del backend (puede ser útil para depurar)
      stompClient.subscribe(`/topic/ubicacion/${camionId}`, (mensaje) => {
        const data = JSON.parse(mensaje.body);
        console.log("📡 Ubicación recibida desde backend:", data);
      });
    });

    return () => {
      console.log("❌ Desconectando WebSocket...");
      if (stompClientRef.current?.connected) {
        stompClientRef.current.disconnect();
      }
    };
  }, [activo, camionId]);

  // Enviar ubicación cuando cambie
  useEffect(() => {
    if (!activo || !ubicacion || !stompClientRef.current?.connected) return;

    stompClientRef.current.send(
      `/topic/ubicacion/${camionId}`,
      {},
      JSON.stringify(ubicacion)
    );

    console.log("📤 Enviando ubicación por WebSocket:", ubicacion);
  }, [ubicacion, activo, camionId]);
}
