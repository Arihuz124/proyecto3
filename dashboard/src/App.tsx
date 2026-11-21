import { useState } from 'react';
import { Box, Grid, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
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

  // Filtrado dinámico de ejemplo según la localidad seleccionada
  const filteredRecords = selectedLocation === 'Todas las localidades'
    ? MOCK_RECORDS
    : MOCK_RECORDS.filter((r) => r.Location === selectedLocation);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // KPIs dinámicos de ejemplo
  const avgMaxTemp = selectedLocation === 'Todas las localidades' ? '23.2' : '27.4';
  const totalRain = selectedLocation === 'Todas las localidades' ? '340,213' : '48,120';
  const rainPct = selectedLocation === 'Todas las localidades' ? 22.4 : 31.0;

  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc);
    setCurrentPage(1); // Reinicia la página al cambiar filtro
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: highlightMode ? '#EFF6FF' : '#F8FAFC' }}>
      <CssBaseline />
      <NavigationMenu activeSection={activeSection} onSelectSection={setActiveSection} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 0 : 3.5,
          pb: isMobile ? 10 : 4,
          width: '100%',
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
            onDateChange={setDateRange}
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

          <ChartsSection
            monthlyTemps={MOCK_MONTHLY_TEMPS}
            topLocations={MOCK_TOP_LOCATIONS}
            rainPercentage={rainPct}
          />

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
  );
}

export default App;