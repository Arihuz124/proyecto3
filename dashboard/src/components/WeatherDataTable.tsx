import React from 'react';
import {
  Paper, Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button
} from '@mui/material';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { WeatherRecord } from '../types/weather';

interface StatusBadgeProps {
  hasRained: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ hasRained }) => (
  <Chip
    label={hasRained ? 'Yes' : 'No'}
    size="small"
    sx={{
      fontWeight: 600,
      bgcolor: hasRained ? '#1E3A8A' : '#F1F5F9',
      color: hasRained ? '#FFFFFF' : '#475569',
    }}
  />
);

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Button size="small" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
      Anterior
    </Button>
    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
      Página {currentPage} de {totalPages}
    </Typography>
    <Button size="small" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
      Siguiente
    </Button>
  </Box>
);

interface WeatherDataTableProps {
  records: WeatherRecord[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const WeatherDataTable: React.FC<WeatherDataTableProps> = ({
  records, totalCount, currentPage, totalPages, onPageChange
}) => (
  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <TableChartOutlinedIcon fontSize="small" sx={{ color: '#1E3A8A' }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Registros meteorológicos</Typography>
    </Box>

    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 700, color: '#475569' } }}>
            <TableCell>Fecha</TableCell>
            <TableCell>Localidad</TableCell>
            <TableCell>MinTemp (°C)</TableCell>
            <TableCell>MaxTemp (°C)</TableCell>
            <TableCell>Rainfall (mm)</TableCell>
            <TableCell>Humidity3pm (%)</TableCell>
            <TableCell>RainToday</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((row, index) => (
            <TableRow key={`${row.Date}-${row.Location}-${index}`}>
              <TableCell>{row.Date}</TableCell>
              <TableCell>{row.Location}</TableCell>
              <TableCell>{row.MinTemp ?? '-'}</TableCell>
              <TableCell>{row.MaxTemp ?? '-'}</TableCell>
              <TableCell>{row.Rainfall ?? '-'}</TableCell>
              <TableCell>{row.Humidity3pm ?? '-'}</TableCell>
              <TableCell><StatusBadge hasRained={row.RainToday === 'Yes'} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Mostrando {records.length} de {totalCount} registros
      </Typography>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </Box>
  </Paper>
);