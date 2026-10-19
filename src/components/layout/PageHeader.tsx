import type { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/** Encabezado estándar de cada vista con título, subtítulo y acciones */
export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={2}
    sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}
  >
    <Stack spacing={0.5}>
      <Typography variant="h1">{title}</Typography>
      {subtitle && <Typography variant="body2">{subtitle}</Typography>}
    </Stack>
    {actions}
  </Stack>
);