import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUser, getUserById, updateUser } from '../api/users.api';
import { toApiError } from '../api/api-error';
import type { UpdateUserDTO, User } from '../models/user.model';
import { buildUserFormSchema, type UserFormValues } from '../schemas/user.schema';
import { useToast } from './useToast';

const EMPTY_VALUES: UserFormValues = { name: '', email: '', role: 'USER', password: '' };

const normalizeText = (value: string): string => value.trim().replace(/\s+/g, ' ');

type LoadState = { status: 'loading' } | { status: 'ready'; user: User | null } | { status: 'error'; message: string };

/**Al crear, la contraseña es obligatoria. Al editar, solo se envía si se escribió una nueva*/
export const useUserForm = (userId: string | null, onSaved: (user: User) => void) => {
  const { showSuccess } = useToast();
  const isEdit = userId !== null;
  const [loadState, setLoadState] = useState<LoadState>(isEdit ? { status: 'loading' } : { status: 'ready', user: null });
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const schema = useMemo(() => buildUserFormSchema(isEdit), [isEdit]);

  const { control, handleSubmit, reset, formState } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    getUserById(userId)
      .then((user) => {
        if (cancelled) return;
        reset({ name: user.name, email: user.email, role: user.role, password: '' });
        setLoadState({ status: 'ready', user });
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadState({ status: 'error', message: toApiError(err).message });
      });

    return () => {
      cancelled = true;
    };
  }, [userId, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (loadState.status !== 'ready') return;
    setSubmitErrors([]);
    const dto: UpdateUserDTO = { name: normalizeText(values.name), email: values.email, role: values.role };
    if (values.password) dto.password = values.password;

    try {
      const saved = loadState.user
        ? await updateUser(loadState.user._id, dto)
        : await createUser({ name: dto.name ?? '', email: values.email, role: values.role, password: values.password });
      showSuccess(isEdit ? `Se actualizó ${saved.name}` : `Se creó el usuario ${saved.name}`);
      onSaved(saved);
    } catch (err) {
      const apiError = toApiError(err);
      setSubmitErrors(apiError.errors.length > 0 ? apiError.errors : [apiError.message]);
    }
  });

  return { control, onSubmit, isEdit, isSubmitting: formState.isSubmitting, loadState, submitErrors };
};