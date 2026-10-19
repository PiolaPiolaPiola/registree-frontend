import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useLoginForm } from '../hooks/useLoginForm';
import { FormTextField } from '../components/form/FormTextField';
import { FormPasswordField } from '../components/form/FormPasswordField';
import type { LoginFormValues } from '../schemas/auth.schema';
import loginImage from '../assets/login.svg';
import logo from '../assets/logo-mark.svg';

export const LoginView = () => {
  const { control, onSubmit, isSubmitting, submitError } = useLoginForm();

  return (
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
          <Typography variant="body2">
            Consulta métricas, administra productos y controla el stock desde un solo tablero.
          </Typography>
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
            <Typography variant="h1">Iniciar sesión</Typography>
            <Typography variant="body2">Ingresa con tu correo y contraseña.</Typography>
          </Stack>

          {submitError && <Alert severity="error">{submitError}</Alert>}

          <Stack component="form" spacing={2.5} onSubmit={onSubmit} noValidate>
            <FormTextField<LoginFormValues>
              name="email"
              control={control}
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              autoFocus
            />
            <FormPasswordField<LoginFormValues>
              name="password"
              control={control}
              label="Contraseña"
              autoComplete="current-password"
            />
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              {isSubmitting ? 'Cargando…' : 'Ingresar'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};