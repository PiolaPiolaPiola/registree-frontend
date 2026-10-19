import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { StatusView } from '../components/feedback/StatusView';
import { PATHS } from '../routes/paths';
import notFoundImage from '../assets/no-encontrado.svg';

/** Ruta inexistente */
export const NotFoundView = () => (
  <StatusView
    image={notFoundImage}
    title="Página no encontrada"
    description="La página que buscas no existe o fue movida."
    action={
      <Button component={Link} to={PATHS.dashboard} variant="contained">
        Ir al dashboard
      </Button>
    }
  />
);