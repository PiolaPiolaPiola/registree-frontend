import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';
import { toApiError } from '../api/api-error';
import { useAuth } from './useAuth';

/**Se consume el endpoint de login con la data del formulario*/
export const useLoginForm = () => {
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login(values);
    } catch (error) {
      setSubmitError(toApiError(error).message);
    }
  });

  return { control, onSubmit, isSubmitting: formState.isSubmitting, submitError };
};