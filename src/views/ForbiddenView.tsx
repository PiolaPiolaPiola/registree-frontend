import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { StatusView } from '../components/feedback/StatusView';
import { PATHS } from '../routes/paths';
import forbiddenImage from '../assets/acceso-denegado.svg';

/** Sección no permitida para el rol del usuario */
export const ForbiddenView = () => (
  <StatusView
    image={forbiddenImage}
    title="Acceso no permitido"
    description="Tu rol no tiene permisos para ver esta sección."
    action={
      <Button component={Link} to={PATHS.dashboard} variant="contained">
        Ir al dashboard
      </Button>
    }
  />
);