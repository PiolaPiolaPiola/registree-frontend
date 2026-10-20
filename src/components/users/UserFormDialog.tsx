import { Alert, Stack } from '@mui/material';
import { FormDialog } from '../feedback/FormDialog';
import { LoadingState } from '../feedback/LoadingState';
import { FormTextField } from '../form/FormTextField';
import { FormPasswordField } from '../form/FormPasswordField';
import { FormSelectField, type SelectOption } from '../form/FormSelectField';
import { useUserForm } from '../../hooks/useUserForm';
import type { UserFormValues } from '../../schemas/user.schema';
import type { User } from '../../models/user.model';

const ROLE_OPTIONS: SelectOption[] = [
  { value: 'USER', label: 'Usuario: solo consulta' },
  { value: 'ADMIN', label: 'Administrador: gestiona productos y usuarios' },
];

interface UserFormDialogProps {
  /** null para crear y el id para editar */
  userId: string | null;
  currentUserId: string | undefined;
  onClose: () => void;
  onSaved: (user: User) => void;
}

/** Modal de crear y editar usuario */
export const UserFormDialog = ({ userId, currentUserId, onClose, onSaved }: UserFormDialogProps) => {
  const { control, onSubmit, isEdit, isSubmitting, loadState, submitErrors } = useUserForm(userId, onSaved);
  const isSelf = isEdit && userId === currentUserId;

  const renderContent = () => {
    if (loadState.status === 'loading') return <LoadingState message="Cargando usuario…" minHeight={260} />;
    if (loadState.status === 'error') return <Alert severity="error">{loadState.message}</Alert>;

    return (
      <Stack spacing={2.5} sx={{ pt: 1 }}>
        {submitErrors.length > 0 && (
          <Alert severity="error">
            {submitErrors.map((message) => (
              <div key={message}>{message}</div>
            ))}
          </Alert>
        )}
        <FormTextField<UserFormValues> name="name" control={control} label="Nombre" required autoFocus autoComplete="off" />
        <FormTextField<UserFormValues> name="email" control={control} label="Email" required type="email" autoComplete="off" />
        <FormSelectField<UserFormValues>
          name="role"
          control={control}
          label="Rol"
          required
          options={ROLE_OPTIONS}
          disabled={isSelf}
          helperText={isSelf ? 'No puedes cambiar tu propio rol' : undefined}
        />
        <FormPasswordField<UserFormValues>
          name="password"
          control={control}
          label={isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'}
          autoComplete="new-password"
          required={!isEdit}
        />
      </Stack>
    );
  };

  return (
    <FormDialog
      open
      title={isEdit ? 'Editar usuario' : 'Nuevo usuario'}
      subtitle={isEdit ? 'Actualiza los datos básicos y el rol' : 'El usuario podrá iniciar sesión con este email y contraseña'}
      submitLabel={isEdit ? 'Guardar cambios' : 'Crear usuario'}
      submitting={isSubmitting}
      submitDisabled={loadState.status !== 'ready'}
      onClose={onClose}
      onSubmit={onSubmit}
      maxWidth="xs"
    >
      {renderContent()}
    </FormDialog>
  );
};