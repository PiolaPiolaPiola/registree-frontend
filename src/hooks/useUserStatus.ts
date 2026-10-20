import { useState } from 'react';
import { setUserStatus } from '../api/users.api';
import { toApiError } from '../api/api-error';
import type { User } from '../models/user.model';
import { useToast } from './useToast';

/**Para activar o desactivar un usuario*/
export const useUserStatus = (onChanged: (user: User) => void) => {
  const { showSuccess, showError } = useToast();
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const requestToggle = (user: User) => setUserToToggle(user);

  const cancelToggle = () => setUserToToggle(null);

  const confirmToggle = async () => {
    if (!userToToggle) return;
    setSaving(true);
    try {
      const updated = await setUserStatus(userToToggle._id, !userToToggle.active);
      showSuccess(`${updated.name} quedó ${updated.active ? 'activo' : 'inactivo'}`);
      onChanged(updated);
      setUserToToggle(null);
    } catch (err) {
      showError(toApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  return { userToToggle, saving, requestToggle, cancelToggle, confirmToggle };
};