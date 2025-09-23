export const getDistanciaYTiempo = async (origen, destino) => {
  const service = new window.google.maps.DistanceMatrixService();

  return new Promise((resolve, reject) => {
    service.getDistanceMatrix(
      {
        origins: [origen],
        destinations: [destino],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          const info = response.rows[0].elements[0];
          resolve({
            distancia: info.distance.text,
            duracion: info.duration.text,
          });
        } else {
          reject(`Error en Distance Matrix: ${status}`);
        }
      }
    );
  });
};
