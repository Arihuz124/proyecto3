import React from 'react';
import { Box, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onToggleTheme: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle, onToggleTheme }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: isMobile ? '#0B132B' : 'transparent',
        color: isMobile ? '#FFFFFF' : '#0F172A',
        px: isMobile ? 2.5 : 0,
        py: isMobile ? 2.5 : 0,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {!isMobile && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <IconButton
        onClick={onToggleTheme}
        sx={{
          bgcolor: '#E0E7FF',
          color: '#1E3A8A',
          px: 2.5,
          borderRadius: 5,
          '&:hover': { bgcolor: '#C7D2FE' },
        }}
      >
        <WbSunnyOutlinedIcon />
      </IconButton>
    </Box>
  );
};