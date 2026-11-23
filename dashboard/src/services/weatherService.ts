import { ref, get } from "firebase/database";
import { database } from "../firebase/firebase";
import { WeatherRecord } from "../types/weather";

type RawTuple = Record<number, string | number | null | undefined>;

interface CompactDataset {
  locations: string[];
  records: RawTuple[] | Record<string, RawTuple>;
}

export interface WeatherDatasetResult {
  locations: string[];
  records: WeatherRecord[];
}

export const obtenerRegistrosClima = async (ruta: string = "weatherData"): Promise<WeatherDatasetResult> => {
  const referencia = ref(database, ruta);
  const snapshot = await get(referencia);

  if (snapshot.exists()) {
    const data = snapshot.val() as CompactDataset;
    const locationsList = data.locations || [];
    const rawRecords: RawTuple[] = Array.isArray(data.records)
      ? data.records
      : Object.values(data.records || {}) as RawTuple[];

    const records: WeatherRecord[] = rawRecords
      .filter(Boolean)
      .map((t: RawTuple) => ({
        Date: String(t[0] ?? ""),
        Location: locationsList[Number(t[1] ?? 0)] ?? "",
        MinTemp: t[2] != null ? Number(t[2]) : null,
        MaxTemp: t[3] != null ? Number(t[3]) : null,
        Rainfall: t[4] != null ? Number(t[4]) : null,
        Humidity3pm: t[5] != null ? Number(t[5]) : null,
        Pressure3pm: null,
        RainToday: t[6] === 1 ? "Yes" : t[6] === 0 ? "No" : null,
        RainTomorrow: null,
      }));

    return {
      locations: ["Todas las localidades", ...locationsList],
      records,
    };
  }

  return { locations: ["Todas las localidades"], records: [] };
};