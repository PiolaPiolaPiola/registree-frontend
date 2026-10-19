import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PATHS } from '../routes/paths';

interface PlaceholderViewProps {
  title: string;
}

export const PlaceholderView = ({ title }: PlaceholderViewProps) => {
  const { user, logout } = useAuth();

  return (
    <Stack spacing={3} sx={{ p: 4 }}>
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body2">Sesión: {user?.name} · {user?.role}</Typography>
      <Stack direction="row" spacing={2}>
        <Button component={Link} to={PATHS.dashboard}>Dashboard</Button>
        <Button component={Link} to={PATHS.inventory}>Inventario</Button>
        <Button component={Link} to={PATHS.users}>Usuarios</Button>
        <Button variant="outlined" onClick={logout}>Cerrar sesión</Button>
      </Stack>
    </Stack>
  );
};