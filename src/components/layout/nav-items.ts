import type { SvgIconComponent } from '@mui/icons-material';
import { DashboardOutlined, Inventory2Outlined, PeopleAltOutlined } from '@mui/icons-material';
import type { UserRole } from '../../models/user.model';
import { PATHS } from '../../routes/paths';

export interface NavItem {
  label: string;
  path: string;
  Icon: SvgIconComponent;
  roles?: readonly UserRole[];
}

/** Opciones del menú lateral */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Dashboard', path: PATHS.dashboard, Icon: DashboardOutlined },
  { label: 'Inventario', path: PATHS.inventory, Icon: Inventory2Outlined },
  { label: 'Usuarios', path: PATHS.users, Icon: PeopleAltOutlined, roles: ['ADMIN'] },
];