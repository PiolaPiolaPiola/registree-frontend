import { Alert, Button, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useLoginForm } from '../hooks/useLoginForm';
import { AuthLayout } from '../components/layout/AuthLayout';
import { FormTextField } from '../components/form/FormTextField';
import { FormPasswordField } from '../components/form/FormPasswordField';
import type { LoginFormValues } from '../schemas/auth.schema';
import { PATHS } from '../routes/paths';

export const LoginView = () => {
  const { control, onSubmit, isSubmitting, submitError } = useLoginForm();

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Ingresa con tu correo y contraseña.">
      {submitError && <Alert severity="error">{submitError}</Alert>}

      <Stack component="form" spacing={2.5} onSubmit={onSubmit} noValidate>
        <FormTextField<LoginFormValues>
          name="email"
          control={control}
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          required
          autoFocus
        />
        <FormPasswordField<LoginFormValues>
          name="password"
          control={control}
          label="Contraseña"
          autoComplete="current-password"
          required
        />
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Cargando…' : 'Ingresar'}
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        ¿No tienes cuenta?{' '}
        <Link component={RouterLink} to={PATHS.register} sx={{ fontWeight: 700 }}>
          Regístrate
        </Link>
      </Typography>
    </AuthLayout>
  );
};
