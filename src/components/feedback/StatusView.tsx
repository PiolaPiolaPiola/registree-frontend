import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface StatusViewProps {
  image: string;
  title: string;
  description: string;
  action?: ReactNode;
}

/** Pantalla de estado para agregar mensaje y tipo de descripción*/
export const StatusView = ({ image, title, description, action }: StatusViewProps) => (
  <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', py: 8, px: 2 }}>
    <Box component="img" src={image} alt="" sx={{ width: '100%', maxWidth: 320 }} />
    <Typography variant="h2">{title}</Typography>
    <Typography variant="body2" sx={{ maxWidth: 420 }}>
      {description}
    </Typography>
    {action}
  </Stack>
);