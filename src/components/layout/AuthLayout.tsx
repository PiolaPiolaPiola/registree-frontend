import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import loginImage from '../../assets/login.svg';
import logo from '../../assets/logo-mark.svg';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Reutilizar layout de login*/
export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.paper' }}>
    <Box
      sx={{
        flex: 1,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: 6,
        bgcolor: 'primary.light',
        borderRadius: '0 40px 40px 0',
      }}
    >
      <Box component="img" src={loginImage} alt="" sx={{ width: '100%', maxWidth: 440 }} />
      <Stack spacing={1} sx={{ textAlign: 'center', maxWidth: 420 }}>
        <Typography variant="h2" color="primary">
          Tu inventario, siempre a la vista
        </Typography>
        <Typography variant="body2">Consulta métricas, administra productos y controla el stock desde un solo tablero.</Typography>
      </Stack>
    </Box>

    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 3, md: 6 } }}>
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 420 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box component="img" src={logo} alt="" sx={{ width: 52, height: 52 }} />
          <Typography variant="h2" component="span" color="primary">
            Registree
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="h1">{title}</Typography>
          <Typography variant="body2">{subtitle}</Typography>
        </Stack>

        {children}
      </Stack>
    </Box>
  </Box>
);
