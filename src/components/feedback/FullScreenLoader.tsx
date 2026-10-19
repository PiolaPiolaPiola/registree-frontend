import { Box, Typography } from '@mui/material';
import spinnerUrl from '../../assets/spinner.svg';

interface FullScreenLoaderProps {
  message?: string;
}

/** Pantalla de carga con spinner*/
export const FullScreenLoader = ({ message = 'Cargando…' }: FullScreenLoaderProps) => (
  <Box
    role="status"
    aria-live="polite"
    sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
  >
    <Box component="img" src={spinnerUrl} alt="" sx={{ width: 72, height: 72 }} />
    <Typography variant="subtitle1" color="primary">
      {message}
    </Typography>
  </Box>
);