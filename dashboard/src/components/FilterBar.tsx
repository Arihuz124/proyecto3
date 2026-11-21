import React from 'react';
import { Grid, Paper, Typography, Select, MenuItem, TextField, Box } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { DateRange } from '../types/weather';

interface FilterBarProps {
  locations: string[];
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  locations, selectedLocation, onLocationChange, dateRange, onDateChange
}) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, lg: 5 }}>
        <Paper variant="outlined" sx={{ p: 1.5, px: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <LocationOnOutlinedIcon color="primary" fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Localidad</Typography>
          </Box>
          <Select
            fullWidth
            size="small"
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            sx={{ borderRadius: 2, bgcolor: '#F8FAFC' }}
          >
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </Select>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            px: 2,
            borderRadius: 3,
            display: 'flex',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            alignItems: 'center',
            gap: 1.5,
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <CalendarTodayOutlinedIcon color="primary" fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Rango de fechas</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, width: '100%', minWidth: 0 }}>
            <TextField
              type="date"
              size="small"
              value={dateRange.startDate}
              onChange={(e) => onDateChange({ ...dateRange, startDate: e.target.value })}
              sx={{ flex: 1, minWidth: 0 }}
            />
            <TextField
              type="date"
              size="small"
              value={dateRange.endDate}
              onChange={(e) => onDateChange({ ...dateRange, endDate: e.target.value })}
              sx={{ flex: 1, minWidth: 0 }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};