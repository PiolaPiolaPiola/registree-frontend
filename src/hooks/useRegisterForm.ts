import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '../schemas/auth.schema';
import { toApiError } from '../api/api-error';
import { useAuth } from './useAuth';

export const useRegisterForm = () => {
  const { register } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await register({ name: values.name.trim().replace(/\s+/g, ' '), email: values.email, password: values.password });
    } catch (error) {
      const apiError = toApiError(error);
      setSubmitError(apiError.errors.length > 0 ? apiError.errors.join('. ') : apiError.message);
    }
  });

  return { control, onSubmit, isSubmitting: formState.isSubmitting, submitError };
};
