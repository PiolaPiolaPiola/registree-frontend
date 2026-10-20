import { Box, Typography } from '@mui/material';
import spinnerUrl from '../../assets/spinner.svg';

interface LoadingStateProps {
  message?: string;
  minHeight?: number | string;
}

export const LoadingState = ({ message = 'Cargando…', minHeight = 280 }: LoadingStateProps) => (
  <Box
    role="status"
    aria-live="polite"
    sx={{ minHeight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
  >
    <Box component="img" src={spinnerUrl} alt="" sx={{ width: 72, height: 72 }} />
    <Typography variant="subtitle1" color="primary">
      {message}
    </Typography>
  </Box>
);