import { useState } from 'react';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api/api-error';

export const LoginView = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const tryLogin = async (email: string, password: string) => {
    setError(null);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  };

  return (
    <Stack spacing={3} sx={{ p: 4, maxWidth: 520 }}>
      <Typography variant="h1">Iniciar sesión</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => tryLogin('admin@registree.com', 'Admin12345')}>Entrar como ADMIN</Button>
        <Button variant="contained" color="secondary" onClick={() => tryLogin('user@registree.com', 'User12345')}>Entrar como USER</Button>
      </Stack>
    </Stack>
  );
};