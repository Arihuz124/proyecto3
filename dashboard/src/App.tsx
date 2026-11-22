import { useState, useEffect } from 'react';
import {
  Box, Grid, CssBaseline, useMediaQuery, useTheme,
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
import { MOCK_LOCATIONS, MOCK_MONTHLY_TEMPS, MOCK_TOP_LOCATIONS, MOCK_RECORDS } from './data/mockWeather';
import { DateRange } from './types/weather';

export function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Estados interactivos con useState
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [selectedLocation, setSelectedLocation] = useState<string>('Todas las localidades');
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '2007-11-01', endDate: '2017-06-25' });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [highlightMode, setHighlightMode] = useState<boolean>(false);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);

  // Detecta la sección
  useEffect(() => {
    const handleScroll = () => {
      if (aboutOpen) return;

      // Si llega al final de la página, resalta directamente "Datos"
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

  // Navegación por desplazamiento o modal
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

  // Filtrado dinámico por localidad y rango de fechas
  const filteredRecords = MOCK_RECORDS.filter((r) => {
    const matchesLocation = selectedLocation === 'Todas las localidades' || r.Location === selectedLocation;
    const matchesStart = !dateRange.startDate || r.Date >= dateRange.startDate;
    const matchesEnd = !dateRange.endDate || r.Date <= dateRange.endDate;
    return matchesLocation && matchesStart && matchesEnd;
  });

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Cálculo dinámico de los KPIs según los registros filtrados
  const validMaxTemps = filteredRecords.filter((r) => r.MaxTemp !== null).map((r) => r.MaxTemp as number);
  const avgMaxTemp = validMaxTemps.length > 0
    ? (validMaxTemps.reduce((acc, val) => acc + val, 0) / validMaxTemps.length).toFixed(1)
    : '0.0';

  const totalRain = filteredRecords
    .reduce((acc, r) => acc + (r.Rainfall ?? 0), 0)
    .toFixed(1);

  const rainCount = filteredRecords.filter((r) => r.RainToday === 'Yes').length;
  const rainPct = filteredRecords.length > 0
    ? Number(((rainCount / filteredRecords.length) * 100).toFixed(1))
    : 0;

  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    setCurrentPage(1);
  };

  const handleDateChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', bgcolor: highlightMode ? '#EFF6FF' : '#F8FAFC' }}>
      <CssBaseline />
      <NavigationMenu activeSection={activeSection} onSelectSection={handleSelectSection} />

      <Box
        id="section-inicio"
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: isMobile ? 0 : 3.5,
          pb: isMobile ? 10 : 4,
        }}
      >
        <DashboardHeader
          title="Australia Weather Dashboard"
          subtitle="Análisis de condiciones meteorológicas en Australia"
          onToggleTheme={() => setHighlightMode(!highlightMode)}
        />

        <Box sx={{ px: isMobile ? 2 : 0 }}>
          <FilterBar
            locations={MOCK_LOCATIONS}
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
              <KpiCard title="Precipitación acumulada" value={totalRain} unit="mm" icon={<WaterDropOutlinedIcon />} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <KpiCard title="Días con lluvia" value={rainPct} unit="%" icon={<PieChartOutlineIcon />} />
            </Grid>
          </Grid>

          <Box id="section-analisis" sx={{ scrollMarginTop: 24 }}>
            <ChartsSection
              monthlyTemps={MOCK_MONTHLY_TEMPS}
              topLocations={MOCK_TOP_LOCATIONS}
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
              <strong>Volumen de datos:</strong> 145,460 observaciones diarias registradas en múltiples estaciones meteorológicas.
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