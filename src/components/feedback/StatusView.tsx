import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface StatusViewProps {
  image: string;
  title: string;
  description: string;
  action?: ReactNode;
  //page para pantalla completa (404, 403). compact para mostrar parcial dentro de una tabla o tarjeta
  size?: 'page' | 'compact';
}

/** Pantalla de estado reutilizable: imagen, título, descripción y una acción opcional */
export const StatusView = ({ image, title, description, action, size = 'page' }: StatusViewProps) => {
  const isCompact = size === 'compact';

  return (
    <Stack spacing={isCompact ? 1.5 : 2} sx={{ alignItems: 'center', textAlign: 'center', py: isCompact ? 4 : 8, px: 2 }}>
      <Box component="img" src={image} alt="" sx={{ width: '100%', maxWidth: isCompact ? 220 : 320 }} />
      <Typography variant={isCompact ? 'h3' : 'h2'}>{title}</Typography>
      <Typography variant="body2" sx={{ maxWidth: 420 }}>
        {description}
      </Typography>
      {action}
    </Stack>
  );
};