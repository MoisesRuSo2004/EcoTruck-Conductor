export const getRutaConDirecciones = async (puntos) => {
  const directionsService = new window.google.maps.DirectionsService();

  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin: puntos[0],
        destination: puntos[puntos.length - 1],
        waypoints: puntos.slice(1, -1).map((p) => ({ location: p })),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          resolve(result);
        } else {
          reject(`Error en Directions API: ${status}`);
        }
      }
    );
  });
};
