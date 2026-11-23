import { useState, useEffect } from "react";
import { WeatherRecord } from "../types/weather";
import { obtenerRegistrosClima } from "../services/weatherService";

export const useWeatherData = () => {
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [locationsList, setLocationsList] = useState<string[]>(['Todas las localidades']);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        const { locations, records: datos } = await obtenerRegistrosClima("weatherData");
        if (isMounted) {
          setLocationsList(locations);
          setRecords(datos);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al recuperar los datos meteorológicos desde Firebase."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, []);

  return { records, locationsList, loading, error };
};