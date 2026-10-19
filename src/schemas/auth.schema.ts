import { z } from 'zod';
import { EMAIL_REGEX } from './patterns';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'El email es obligatorio')
    .max(254, 'El email puede tener máximo 254 caracteres')
    .regex(EMAIL_REGEX, 'Ingresa un correo válido, por ejemplo nombre@correo.com'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;