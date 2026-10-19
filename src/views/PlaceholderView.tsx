import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { PATHS } from '../routes/paths';

interface PlaceholderViewProps {
  title: string;
}

export const PlaceholderView = ({ title }: PlaceholderViewProps) => {
  const { user, logout } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Stack spacing={3} sx={{ p: 4 }}>
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body2">Sesión: {user?.name} · {user?.role}</Typography>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
        <Button component={Link} to={PATHS.dashboard}>Dashboard</Button>
        <Button component={Link} to={PATHS.inventory}>Inventario</Button>
        <Button component={Link} to={PATHS.users}>Usuarios</Button>
        <Button variant="outlined" onClick={logout}>Cerrar sesión</Button>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
        <Button onClick={() => showSuccess('Producto eliminado correctamente')}>Toast éxito</Button>
        <Button onClick={() => showError('No se pudo guardar el producto. Intenta de nuevo.')}>Toast error</Button>
        <Button onClick={() => showInfo('Producto restaurado')}>Toast info</Button>
        <Button color="error" onClick={() => setConfirmOpen(true)}>Abrir confirmación</Button>
      </Stack>
      <ConfirmDialog
        open={confirmOpen}
        tone="danger"
        title="¿Eliminar este producto?"
        description={<><strong>Bomba centrífuga 1 HP</strong> dejará de aparecer en el inventario y en las métricas.</>}
        confirmLabel="Eliminar"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          showSuccess('Producto eliminado correctamente');
        }}
      />
    </Stack>
  );
};