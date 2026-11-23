import { useState, useEffect, useMemo } from 'react';
import {
  Box, Grid, CssBaseline, useMediaQuery, useTheme, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography
} from '@mui/material';
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutlineOutlined';

import { NavigationMenu } from './components/NavigationMenu';
import { DashboardHeader } from './components/DashboardHeader';
import { FilterBar } from './components/FilterBar';
import { KpiCard } from './components/KpiCard';
import { ChartsSection } from './components/ChartsSection';
import { WeatherDataTable } from './components/WeatherDataTable';
import { DateRange, TopLocationData, MonthlyTempData } from './types/weather';
import { useWeatherData } from './hooks/useWeatherData';

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Consumo de datos desde Firebase Realtime Database mediante hook personalizado
  const { records: allRecords, locationsList, loading, error } = useWeatherData();

  // Estados interactivos con useState
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [selectedLocation, setSelectedLocation] = useState<string>('Todas las localidades');
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '2007-11-01', endDate: '2017-06-25' });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [highlightMode, setHighlightMode] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (aboutOpen) return;

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      if (atBottom) {
        setActiveSection('datos');
        return;
      }

      const sections = ['datos', 'analisis', 'inicio'];
      for (const id of sections) {
        const el = document.getElementById(`section-${id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [aboutOpen]);

  const handleSelectSection = (section: string) => {
    setActiveSection(section);
    if (section === 'acerca') {
      setAboutOpen(true);
      return;
    }
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCloseAbout = () => {
    setAboutOpen(false);
    setActiveSection('inicio');
  };

  // Filtrado en memoria sobre los registros
  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      const matchesLocation = selectedLocation === 'Todas las localidades' || r.Location === selectedLocation;
      const matchesStart = !dateRange.startDate || r.Date >= dateRange.startDate;
      const matchesEnd = !dateRange.endDate || r.Date <= dateRange.endDate;
      return matchesLocation && matchesStart && matchesEnd;
    });
  }, [allRecords, selectedLocation, dateRange]);

  // Cálculo dinámico de KPIs
  const {
    avgMaxTemp,
    totalRainFormatted,
    rainCount,
    noRainCount,
    totalValidRainRecords,
    rainPct,
    topLocations,
    monthlyTemps,
  } = useMemo(() => {
    let maxTempSum = 0;
    let maxTempCount = 0;
    let rainSum = 0;
    let yesCount = 0;
    let noCount = 0;

    const rainByLocation: Record<string, number> = {};
    const monthStats = Array.from({ length: 12 }, () => ({
      maxSum: 0,
      maxCount: 0,
      minSum: 0,
      minCount: 0,
    }));

    for (const r of filteredRecords) {
      if (r.MaxTemp !== null) {
        maxTempSum += r.MaxTemp;
        maxTempCount++;
      }
      if (r.Rainfall !== null) {
        rainSum += r.Rainfall;
        rainByLocation[r.Location] = (rainByLocation[r.Location] ?? 0) + r.Rainfall;
      }
      if (r.RainToday === 'Yes') yesCount++;
      else if (r.RainToday === 'No') noCount++;

      const monthIdx = parseInt(r.Date.slice(5, 7), 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        if (r.MaxTemp !== null) {
          monthStats[monthIdx].maxSum += r.MaxTemp;
          monthStats[monthIdx].maxCount++;
        }
        if (r.MinTemp !== null) {
          monthStats[monthIdx].minSum += r.MinTemp;
          monthStats[monthIdx].minCount++;
        }
      }
    }

    const validRain = yesCount + noCount;
    const computedTopLocations: TopLocationData[] = Object.entries(rainByLocation)
      .map(([location, totalRainfall]) => ({
        location,
        totalRainfall: Number(totalRainfall.toFixed(1)),
      }))
      .sort((a, b) => b.totalRainfall - a.totalRainfall)
      .slice(0, 5);

    const computedMonthlyTemps: MonthlyTempData[] = monthStats.map((m, idx) => ({
      period: MONTH_LABELS[idx],
      maxTemp: m.maxCount > 0 ? Number((m.maxSum / m.maxCount).toFixed(1)) : 0,
      minTemp: m.minCount > 0 ? Number((m.minSum / m.minCount).toFixed(1)) : 0,
    }));

    return {
      avgMaxTemp: maxTempCount > 0 ? (maxTempSum / maxTempCount).toFixed(1) : '0.0',
      totalRainFormatted: Math.round(rainSum).toLocaleString('en-US'),
      rainCount: yesCount,
      noRainCount: noCount,
      totalValidRainRecords: validRain,
      rainPct: validRain > 0 ? Number(((yesCount / validRain) * 100).toFixed(1)) : 0,
      topLocations: computedTopLocations,
      monthlyTemps: computedMonthlyTemps,
    };
  }, [filteredRecords]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    setCurrentPage(1);
  };

  const handleDateChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        bgcolor: highlightMode ? '#EFF6FF' : '#F8FAFC',
      }}
    >
      <CssBaseline />
      <NavigationMenu activeSection={activeSection} onSelectSection={handleSelectSection} />

      <Box
        id="section-inicio"
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden',
          p: isMobile ? 0 : 3.5,
          pb: isMobile ? 10 : 4,
        }}
      >
        <DashboardHeader
          title="Australia Weather Dashboard"
          subtitle="Análisis de condiciones meteorológicas en Australia"
          onToggleTheme={() => setHighlightMode(!highlightMode)}
        />

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12, gap: 2 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Cargando registros meteorológicos desde Firebase...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              Error al conectar con Firebase Realtime Database: {error}
            </Alert>
          </Box>
        ) : (
          <Box sx={{ px: isMobile ? 2 : 0, width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
            <FilterBar
              locations={locationsList}
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
              dateRange={dateRange}
              onDateChange={handleDateChange}
            />

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <KpiCard title="Temperatura máxima promedio" value={avgMaxTemp} unit="°C" icon={<ThermostatOutlinedIcon />} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <KpiCard title="Precipitación acumulada" value={totalRainFormatted} unit="mm" icon={<WaterDropOutlinedIcon />} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <KpiCard title="Días con lluvia" value={rainPct} unit="%" icon={<PieChartOutlineIcon />} />
              </Grid>
            </Grid>

            <Box id="section-analisis" sx={{ scrollMarginTop: 24 }}>
              <ChartsSection
                monthlyTemps={monthlyTemps}
                topLocations={topLocations}
                totalValidRainRecords={totalValidRainRecords}
                rainCount={rainCount}
                noRainCount={noRainCount}
                rainPercentage={rainPct}
              />
            </Box>

            <Box id="section-datos" sx={{ scrollMarginTop: 24 }}>
              <WeatherDataTable
                records={paginatedRecords}
                totalCount={filteredRecords.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Ventana emergente para "Acerca del dataset" */}
      <Dialog open={aboutOpen} onClose={handleCloseAbout} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Acerca del dataset</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="body2">
            <strong>Rain in Australia (weatherAUS)</strong> es un conjunto de datos meteorológicos
            históricos provenientes de la Oficina de Meteorología de Australia y publicados en Kaggle.
          </Typography>

          <Box component="ul" sx={{ pl: 2.5, m: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography component="li" variant="body2">
              <strong>Volumen de datos:</strong> 145,460 observaciones diarias registradas en 49 estaciones meteorológicas.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Período cubierto:</strong> Del 1 de noviembre de 2007 al 25 de junio de 2017.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Variables principales:</strong> Fecha (<em>Date</em>), localidad (<em>Location</em>), temperaturas mínima y máxima (<em>MinTemp, MaxTemp</em>), precipitación (<em>Rainfall</em>), humedad (<em>Humidity3pm</em>) e indicadores de lluvia (<em>RainToday, RainTomorrow</em>).
            </Typography>
          </Box>

          <Typography variant="body2">
            <strong>Fuente oficial:</strong>{' '}
            <a
              href="https://www.kaggle.com/datasets/jsphyg/weather-dataset-rattle-package?resource=download"
              target="_blank"
              rel="noopener noreferrer"
            >
              Descargar dataset en Kaggle
            </a>
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
            Proyecto 03 · Desarrollo de Aplicaciones Web y Móviles (ESPOL) — Desarrollado por Sebastián Toral y Arihuz Icaza.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAbout} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;