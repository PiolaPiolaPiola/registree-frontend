import { Avatar, Chip, Stack, Typography } from '@mui/material';
import type { DataTableColumn } from '../table/table.types';
import type { User } from '../../models/user.model';
import { getInitials } from '../../utils/text';
import { formatDate } from '../../utils/format';

/** Columnas de la tabla de usuarios: nombre, email, rol, estado y fecha de creación */
export const USER_COLUMNS: DataTableColumn<User>[] = [
  {
    id: 'name',
    header: 'Nombre',
    render: (user) => (
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Avatar sx={{ width: 34, height: 34, fontSize: 14, fontWeight: 800, bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
          {getInitials(user.name)}
        </Avatar>
        <Typography sx={{ fontWeight: 700, maxWidth: { xs: 160, lg: 220 } }} noWrap title={user.name}>
          {user.name}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 'email',
    header: 'Email',
    render: (user) => (
      <Typography variant="body2" sx={{ maxWidth: { xs: 180, lg: 240 } }} noWrap title={user.email}>
        {user.email}
      </Typography>
    ),
  },
  {
    id: 'role',
    header: 'Rol',
    render: (user) => (
      <Chip
        label={user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
        size="small"
        sx={{ fontWeight: 700, bgcolor: user.role === 'ADMIN' ? 'primary.main' : 'primary.light', color: user.role === 'ADMIN' ? 'primary.contrastText' : 'primary.dark' }}
      />
    ),
  },
  {
    id: 'active',
    header: 'Estado',
    render: (user) => (
      <Chip
        label={user.active ? 'Activo' : 'Inactivo'}
        size="small"
        variant="outlined"
        color={user.active ? 'success' : 'default'}
        sx={{ fontWeight: 700, color: user.active ? 'success.dark' : 'text.secondary' }}
      />
    ),
  },
  {
    id: 'creationAt',
    header: 'Fecha de creación',
    render: (user) => (
      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
        {formatDate(user.creationAt)}
      </Typography>
    ),
  },
];