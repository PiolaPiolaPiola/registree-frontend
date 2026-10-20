import { useState } from 'react';
import { Button, Card, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { AddRounded, BlockOutlined, CheckCircleOutlined, EditOutlined } from '@mui/icons-material';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusView } from '../components/feedback/StatusView';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { DataTable } from '../components/table/DataTable';
import { USER_COLUMNS } from '../components/users/user-columns';
import { UserFormDialog } from '../components/users/UserFormDialog';
import type { RowAction } from '../components/table/table.types';
import type { User } from '../models/user.model';
import { useAuth } from '../hooks/useAuth';
import { useUsers } from '../hooks/useUsers';
import { useUserStatus } from '../hooks/useUserStatus';
import { formatNumber } from '../utils/format';
import usersEmptyImage from '../assets/usuarios-vacio.svg';

export const UsersView = () => {
  const { user: currentUser } = useAuth();
  const users = useUsers();
  const { rows, total, pagination } = users;
  /** null: modal cerrado. userId null: crear; con id: editar */
  const [formTarget, setFormTarget] = useState<{ userId: string | null } | null>(null);

  const handleStatusChanged = () => {
    if (rows.length === 1 && pagination.page > 0) {
      pagination.setPage(pagination.page - 1);
    } else {
      users.reload();
    }
  };

  const { userToToggle, saving, requestToggle, cancelToggle, confirmToggle } = useUserStatus(handleStatusChanged);

  const handleSaved = () => {
    setFormTarget(null);
    users.reload();
  };

  /** El ADMIN con sesión no puede inactivarse a sí mismo */
  const getRowActions = (user: User): RowAction[] => {
    const isSelf = user._id === currentUser?._id;
    return [
      { label: `Editar ${user.name}`, icon: <EditOutlined fontSize="small" />, onClick: () => setFormTarget({ userId: user._id }) },
      user.active
        ? {
            label: isSelf ? 'No puedes inactivar tu propio usuario' : `Inactivar ${user.name}`,
            icon: <BlockOutlined fontSize="small" />,
            onClick: () => requestToggle(user),
            color: 'error',
            disabled: isSelf,
          }
        : { label: `Reactivar ${user.name}`, icon: <CheckCircleOutlined fontSize="small" />, onClick: () => requestToggle(user), color: 'success' },
    ];
  };

  const isDeactivating = userToToggle?.active ?? false;

  return (
    <>
      <PageHeader
        title="Usuarios"
        subtitle={users.loading ? 'Cargando usuarios…' : `${formatNumber(total)} usuarios ${users.active ? 'activos' : 'inactivos'}`}
        actions={
          <Button variant="contained" startIcon={<AddRounded />} onClick={() => setFormTarget({ userId: null })}>
            Nuevo usuario
          </Button>
        }
      />

      <Card>
        <Stack direction="row" sx={{ p: 2 }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            color="primary"
            value={users.active ? 'active' : 'inactive'}
            onChange={(_, value: 'active' | 'inactive' | null) => value && users.setActive(value === 'active')}
            aria-label="Filtrar por estado"
          >
            <ToggleButton value="active" sx={{ px: 2, fontWeight: 700 }}>
              Activos
            </ToggleButton>
            <ToggleButton value="inactive" sx={{ px: 2, fontWeight: 700 }}>
              Inactivos
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {users.error && rows.length === 0 ? (
          <StatusView
            size="compact"
            image={usersEmptyImage}
            title="No pudimos cargar los usuarios"
            description={users.error}
            action={<Button variant="contained" onClick={users.reload}>Reintentar</Button>}
          />
        ) : (
          <DataTable
            ariaLabel="Usuarios"
            columns={USER_COLUMNS}
            rows={rows}
            getRowId={(user) => user._id}
            getRowActions={getRowActions}
            loading={users.loading}
            refreshing={users.refreshing}
            minWidth={760}
            emptyState={
              <StatusView
                size="compact"
                image={usersEmptyImage}
                title={users.active ? 'No hay usuarios activos' : 'No hay usuarios inactivos'}
                description={users.active ? 'Crea un usuario para darle acceso al dashboard.' : 'Los usuarios que inactives aparecerán aquí y podrás reactivarlos.'}
              />
            }
            pagination={{
              page: pagination.page,
              rowsPerPage: pagination.rowsPerPage,
              total,
              onPageChange: pagination.setPage,
              onRowsPerPageChange: pagination.setRowsPerPage,
            }}
          />
        )}
      </Card>

      {formTarget && (
        <UserFormDialog
          userId={formTarget.userId}
          currentUserId={currentUser?._id}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={userToToggle !== null}
        tone={isDeactivating ? 'danger' : 'primary'}
        icon={isDeactivating ? <BlockOutlined sx={{ fontSize: 40 }} aria-hidden /> : <CheckCircleOutlined sx={{ fontSize: 40 }} aria-hidden />}
        title={isDeactivating ? '¿Inactivar usuario?' : '¿Reactivar usuario?'}
        description={
          <>
            <strong>{userToToggle?.name}</strong>{' '}
            {isDeactivating ? 'no podrá iniciar sesión hasta que lo reactives. Sus datos se conservan.' : 'podrá volver a iniciar sesión.'}
          </>
        }
        confirmLabel={isDeactivating ? 'Inactivar' : 'Reactivar'}
        loading={saving}
        onConfirm={confirmToggle}
        onCancel={cancelToggle}
      />
    </>
  );
};