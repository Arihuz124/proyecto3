import { WeatherRecord, TopLocationData, MonthlyTempData } from '../types/weather';

export const MOCK_LOCATIONS = ['Todas las localidades', 'Albury', 'Cairns', 'Darwin', 'Sydney', 'Perth', 'Melbourne'];

export const MOCK_MONTHLY_TEMPS: MonthlyTempData[] = [
  { period: 'Ene', maxTemp: 29.5, minTemp: 14.8 },
  { period: 'Feb', maxTemp: 30.2, minTemp: 15.1 },
  { period: 'Mar', maxTemp: 29.6, minTemp: 14.2 },
  { period: 'Abr', maxTemp: 27.5, minTemp: 11.9 },
  { period: 'May', maxTemp: 24.8, minTemp: 9.0 },
  { period: 'Jun', maxTemp: 22.1, minTemp: 6.2 },
  { period: 'Jul', maxTemp: 21.9, minTemp: 5.5 },
  { period: 'Ago', maxTemp: 23.8, minTemp: 6.8 },
  { period: 'Sep', maxTemp: 26.0, minTemp: 8.9 },
  { period: 'Oct', maxTemp: 27.9, minTemp: 11.2 },
  { period: 'Nov', maxTemp: 28.6, minTemp: 12.8 },
  { period: 'Dic', maxTemp: 30.5, minTemp: 14.5 },
];

export const MOCK_TOP_LOCATIONS: TopLocationData[] = [
  { location: 'Cairns', totalRainfall: 2510 },
  { location: 'Darwin', totalRainfall: 1900 },
  { location: 'Sydney', totalRainfall: 1300 },
  { location: 'Perth', totalRainfall: 870 },
  { location: 'Melbourne', totalRainfall: 740 },
];

export const MOCK_RECORDS: WeatherRecord[] = [
  { Date: '2008-12-01', Location: 'Albury', MinTemp: 13.4, MaxTemp: 22.9, Rainfall: 0.6, Humidity3pm: 22, Pressure3pm: 1007.1, RainToday: 'No', RainTomorrow: 'No' },
  { Date: '2008-12-02', Location: 'Albury', MinTemp: 7.4, MaxTemp: 25.1, Rainfall: 0.0, Humidity3pm: 25, Pressure3pm: 1007.8, RainToday: 'No', RainTomorrow: 'No' },
  { Date: '2008-12-03', Location: 'Cairns', MinTemp: 21.8, MaxTemp: 31.2, Rainfall: 14.4, Humidity3pm: 68, Pressure3pm: 1009.2, RainToday: 'Yes', RainTomorrow: 'Yes' },
  { Date: '2008-12-04', Location: 'Sydney', MinTemp: 16.5, MaxTemp: 24.0, Rainfall: 0.0, Humidity3pm: 54, Pressure3pm: 1015.0, RainToday: 'No', RainTomorrow: 'No' },
  { Date: '2008-12-05', Location: 'Darwin', MinTemp: 24.1, MaxTemp: 33.4, Rainfall: 8.2, Humidity3pm: 72, Pressure3pm: 1008.4, RainToday: 'Yes', RainTomorrow: 'No' },
  { Date: '2008-12-06', Location: 'Perth', MinTemp: 14.0, MaxTemp: 27.8, Rainfall: 0.0, Humidity3pm: 38, Pressure3pm: 1014.3, RainToday: 'No', RainTomorrow: 'No' },
  { Date: '2008-12-07', Location: 'Melbourne', MinTemp: 11.2, MaxTemp: 19.6, Rainfall: 3.4, Humidity3pm: 61, Pressure3pm: 1012.1, RainToday: 'Yes', RainTomorrow: 'No' },
];