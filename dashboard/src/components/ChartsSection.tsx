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
  rainPercentage: number;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ monthlyTemps, topLocations, rainPercentage }) => {
  const noRainPercentage = Number((100 - rainPercentage).toFixed(1));

  return (

    <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Fila precipitacion*/}
      <Grid size={{ xs: 12, md: 7 }}>
        <ChartCard title="Precipitación por localidad (Top 5)" icon={<BarChartIcon fontSize="small" />}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8, pt: 1 }}>
            {topLocations.map((item) => (
              <Box key={item.location}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.location}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item.totalRainfall} mm</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(item.totalRainfall / 2600) * 100}
                  sx={{ height: 10, borderRadius: 2, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#1E3A8A' } }}
                />
              </Box>
            ))}
          </Box>
        </ChartCard>
      </Grid>

    {/* Fila Días con y sin lluvia*/}
      <Grid size={{ xs: 12, md: 5 }}>
        <ChartCard title="Días con y sin lluvia" icon={<PieChartOutlineIcon fontSize="small" />}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: 220 }}>
            <Box
              sx={{
                width: 145,
                height: 145,
                borderRadius: '50%',
                background: `conic-gradient(#1E3A8A 0% ${rainPercentage}%, #60A5FA ${rainPercentage}% 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ width: 92, height: 92, borderRadius: '50%', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>145,460</Typography>
                <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary' }}>registros</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E3A8A' }}>■ Con lluvia</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{rainPercentage}% · 32,583 registros</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#60A5FA' }}>■ Sin lluvia</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{noRainPercentage}% · 112,877 registros</Typography>
              </Box>
            </Box>
          </Box>
        </ChartCard>
      </Grid>

      {/* Fila inferior completa: Evolución de temperaturas */}
      <Grid size={{ xs: 12 }}>
        <ChartCard title="Evolución de temperaturas" icon={<ShowChartIcon fontSize="small" />}>
          <Box sx={{ height: 210, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', px: 2, pt: 2, borderBottom: '1px solid #E2E8F0' }}>
            {monthlyTemps.map((m) => (
              <Box key={m.period} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, flex: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 11, color: '#1E3A8A', fontWeight: 600 }}>
                  {m.maxTemp}°
                </Typography>
                <Box sx={{ width: 14, height: `${m.maxTemp * 3.5}px`, bgcolor: '#1E3A8A', borderRadius: 1 }} />
                <Box sx={{ width: 14, height: `${m.minTemp * 3.5}px`, bgcolor: '#DC2626', borderRadius: 1 }} />
                <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
                  {m.period}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 3, mt: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#1E3A8A', fontWeight: 600 }}>● Temp. máxima</Typography>
            <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 600 }}>● Temp. mínima</Typography>
          </Box>
        </ChartCard>
      </Grid>
    </Grid>
  );
};