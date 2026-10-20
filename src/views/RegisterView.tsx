import { Alert, Button, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { FormTextField } from '../components/form/FormTextField';
import { FormPasswordField } from '../components/form/FormPasswordField';
import { useRegisterForm } from '../hooks/useRegisterForm';
import type { RegisterFormValues } from '../schemas/auth.schema';
import { PATHS } from '../routes/paths';

export const RegisterView = () => {
  const { control, onSubmit, isSubmitting, submitError } = useRegisterForm();

  return (
    <AuthLayout title="Crear cuenta" subtitle="Tendrás acceso de consulta al dashboard y al inventario.">
      {submitError && <Alert severity="error">{submitError}</Alert>}

      <Stack component="form" spacing={2.5} onSubmit={onSubmit} noValidate>
        <FormTextField<RegisterFormValues> name="name" control={control} label="Nombre" autoComplete="name" required autoFocus />
        <FormTextField<RegisterFormValues> name="email" control={control} label="Correo electrónico" type="email" autoComplete="email" required />
        <FormPasswordField<RegisterFormValues> name="password" control={control} label="Contraseña" autoComplete="new-password" required />
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        ¿Ya tienes cuenta?{' '}
        <Link component={RouterLink} to={PATHS.login} sx={{ fontWeight: 700 }}>
          Inicia sesión
        </Link>
      </Typography>
    </AuthLayout>
  );
};
