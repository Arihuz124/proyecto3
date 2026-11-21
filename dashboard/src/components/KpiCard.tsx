import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

interface KpiCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, unit, icon }) => (
  <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ bgcolor: '#E0E7FF', color: '#1D4ED8', p: 1.5, borderRadius: 2.5, display: 'flex' }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A' }}>
        {value} {unit}
      </Typography>
    </Box>
  </Paper>
);