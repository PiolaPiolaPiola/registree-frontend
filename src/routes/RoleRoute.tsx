import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../models/user.model';
import { ForbiddenView } from '../views/ForbiddenView';

interface RoleRouteProps {
  allowedRoles: readonly UserRole[];
}

/** Permite el acceso solo a los roles indicados*/
export const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <ForbiddenView />;
  }

  return <Outlet />;
};