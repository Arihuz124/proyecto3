import React from 'react';
import { Grid, Box, Typography, LinearProgress } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutlineOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import { ChartCard } from './ChartCard';
import { MonthlyTempData, TopLocationData } from '../types/weather';

interface ChartsSectionProps {
  monthlyTemps: MonthlyTempData[];
  topLocations: TopLocationData[];
  totalValidRainRecords: number;
  rainCount: number;
  noRainCount: number;
  rainPercentage: number;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  monthlyTemps,
  topLocations,
  totalValidRainRecords,
  rainCount,
  noRainCount,
  rainPercentage,
}) => {
  const noRainPercentage = totalValidRainRecords > 0
    ? Number((100 - rainPercentage).toFixed(1))
    : 0;

  const maxBarRainfall = topLocations.length > 0
    ? Math.max(...topLocations.map((item) => item.totalRainfall), 1)
    : 1;

  const maxChartTemp = monthlyTemps.length > 0
    ? Math.max(...monthlyTemps.map((m) => m.maxTemp), 35)
    : 35;

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {/* Fila superior izquierda: Precipitación por localidad (Top 5) */}
      <Grid size={{ xs: 12, md: 7 }}>
        <ChartCard title="Precipitación por localidad (Top 5)" icon={<BarChartIcon fontSize="small" />}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, pt: 1 }}>
            {topLocations.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sin registros para el filtro seleccionado.
              </Typography>
            ) : (
              topLocations.map((item) => (
                <Box key={item.location}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.location}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {item.totalRainfall.toLocaleString('en-US', { maximumFractionDigits: 1 })} mm
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(item.totalRainfall / maxBarRainfall) * 100}
                    sx={{ height: 10, borderRadius: 2, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#1E3A8A' } }}
                  />
                </Box>
              ))
            )}
          </Box>
        </ChartCard>
      </Grid>

      {/* Fila superior derecha: Días con y sin lluvia (Dona) */}
      <Grid size={{ xs: 12, md: 5 }}>
        <ChartCard title="Días con y sin lluvia" icon={<PieChartOutlineIcon fontSize="small" />}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 220 }}>
            <Box
              sx={{
                width: 145,
                height: 145,
                borderRadius: '50%',
                background: totalValidRainRecords > 0
                  ? `conic-gradient(#1E3A8A 0% ${rainPercentage}%, #60A5FA ${rainPercentage}% 100%)`
                  : '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ width: 92, height: 92, borderRadius: '50%', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Válidos</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {totalValidRainRecords.toLocaleString('en-US')}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary' }}>registros</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A8A' }}>■ Con lluvia</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {rainPercentage}% · {rainCount.toLocaleString('en-US')} registros
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#60A5FA' }}>■ Sin lluvia</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {noRainPercentage}% · {noRainCount.toLocaleString('en-US')} registros
                </Typography>
              </Box>
            </Box>
          </Box>
        </ChartCard>
      </Grid>

      {/* Fila inferior completa: Evolución de temperaturas */}
      <Grid size={{ xs: 12 }}>
        <ChartCard title="Evolución de temperaturas (Promedio mensual)" icon={<ShowChartIcon fontSize="small" />}>
          <Box
            sx={{
              height: 215,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              px: { xs: 0.5, sm: 2 },
              pt: 2,
              borderBottom: '1px solid #E2E8F0',
              overflow: 'hidden',
            }}
          >
            {monthlyTemps.map((m) => {
              const maxH = Math.max(4, Math.round((m.maxTemp / maxChartTemp) * 105));
              const minH = Math.max(4, Math.round((Math.max(0, m.minTemp) / maxChartTemp) * 105));
              return (
                <Box
                  key={m.period}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontSize: { xs: 9.5, sm: 11 }, color: '#1E3A8A', fontWeight: 600 }}
                  >
                    {m.maxTemp > 0 ? `${m.maxTemp}°` : '-'}
                  </Typography>
                  <Box sx={{ width: { xs: 9, sm: 14 }, height: `${maxH}px`, bgcolor: '#1E3A8A', borderRadius: 1 }} />
                  <Box sx={{ width: { xs: 9, sm: 14 }, height: `${minH}px`, bgcolor: '#DC2626', borderRadius: 1 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontSize: { xs: 9.5, sm: 11 }, color: 'text.secondary' }}
                  >
                    {m.period}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box sx={{ display: 'flex', gap: 3, mt: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#1E3A8A', fontWeight: 600 }}>● Temp. máxima prom.</Typography>
            <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 600 }}>● Temp. mínima prom.</Typography>
          </Box>
        </ChartCard>
      </Grid>
    </Grid>
  );
};