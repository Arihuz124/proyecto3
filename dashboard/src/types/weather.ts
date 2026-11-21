export interface WeatherRecord {
  Date: string;
  Location: string;
  MinTemp: number | null;
  MaxTemp: number | null;
  Rainfall: number | null;
  Humidity3pm: number | null;
  Pressure3pm: number | null;
  RainToday: 'Yes' | 'No' | null;
  RainTomorrow: 'Yes' | 'No' | null;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface TopLocationData {
  location: string;
  totalRainfall: number;
}

export interface MonthlyTempData {
  period: string;
  maxTemp: number;
  minTemp: number;
}