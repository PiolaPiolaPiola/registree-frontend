import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FullScreenLoader } from '../components/feedback/FullScreenLoader';
import { PATHS } from './paths';

interface AuthRouteProps {
  /** private: exige sesión. public: solo sin sesión (login) */
  access: 'private' | 'public';
}

/** Lee la ruta a la que el usuario quería ir antes de ser enviado al login */
const getRedirectPath = (state: unknown): string => {
  if (typeof state === 'object' && state !== null && 'from' in state && typeof state.from === 'string') {
    return state.from;
  }
  return PATHS.dashboard;
};

/**Controla el acceso según la sesión.
 * - private: sin sesión redirige al login, guardando la ruta anterior.
 * - public: con sesión redirige a la ruta anterior o al dashboard.
 */
export const AuthRoute = ({ access }: AuthRouteProps) => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'checking') {
    return <FullScreenLoader message="Cargando…" />;
  }

  if (access === 'private' && status === 'unauthenticated') {
    return <Navigate to={PATHS.login} replace state={{ from: location.pathname }} />;
  }

  if (access === 'public' && status === 'authenticated') {
    return <Navigate to={getRedirectPath(location.state)} replace />;
  }

  return <Outlet />;
};