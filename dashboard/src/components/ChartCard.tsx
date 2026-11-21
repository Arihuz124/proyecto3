import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

interface ChartCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, icon, children }) => (
  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Box sx={{ color: '#1E3A8A', display: 'flex' }}>{icon}</Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
        {title}
      </Typography>
    </Box>
    {children}
  </Paper>
);