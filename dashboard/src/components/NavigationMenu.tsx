import React from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, BottomNavigation, BottomNavigationAction, Paper, useMediaQuery, useTheme
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';

interface NavigationMenuProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
}

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', icon: <HomeOutlinedIcon /> },
  { id: 'analisis', label: 'Análisis', icon: <BarChartOutlinedIcon /> },
  { id: 'datos', label: 'Datos', icon: <TableChartOutlinedIcon /> },
  { id: 'acerca', label: 'Acerca del dataset', icon: <InfoOutlinedIcon /> },
];

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ activeSection, onSelectSection }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }} elevation={6}>
        <BottomNavigation
          value={activeSection}
          onChange={(_, newValue) => onSelectSection(newValue)}
          sx={{
            bgcolor: '#0B132B',
            height: 64,
            '& .MuiBottomNavigationAction-root': { color: '#94A3B8' },
            '& .Mui-selected': { color: '#FFFFFF' },
          }}
        >
          {NAV_ITEMS.map((item) => (
            <BottomNavigationAction key={item.id} value={item.id} icon={item.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: '#0B132B',
          color: '#FFFFFF',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, px: 1 }}>
          <WbSunnyOutlinedIcon sx={{ color: '#60A5FA', fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              AU Weather
            </Typography>
            <Typography variant="caption" sx={{ color: '#60A5FA' }}>
              Dashboard
            </Typography>
          </Box>
        </Box>

        <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {NAV_ITEMS.map((item) => {
            const selected = activeSection === item.id;
            return (
              <ListItemButton
                key={item.id}
                selected={selected}
                onClick={() => onSelectSection(item.id)}
                sx={{
                  borderRadius: 2,
                  bgcolor: selected ? 'rgba(59, 130, 246, 0.22) !important' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                }}
              >
                <ListItemIcon sx={{ color: selected ? '#FFFFFF' : '#94A3B8', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: { fontSize: 14, fontWeight: selected ? 600 : 400 },
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ bgcolor: 'rgba(255,255,255,0.06)', p: 1.5, borderRadius: 2 }}>
        <Typography variant="caption" sx={{ display: 'block', color: '#94A3B8', fontWeight: 600 }}>
          Fuente de datos
        </Typography>
        <Typography variant="caption" sx={{ color: '#CBD5E1', fontSize: 11 }}>
          Rain in Australia (Kaggle) · Oficina de Meteorología de Australia
        </Typography>
      </Box>
    </Drawer>
  );
};