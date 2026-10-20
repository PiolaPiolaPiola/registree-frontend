import { z } from 'zod';
import { EMAIL_REGEX } from './patterns';
import { buildUserFormSchema } from './user.schema';

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

/** Se usa para el registro las mismas validaciones del login*/
export const registerSchema = buildUserFormSchema(false).omit({ role: true });

export type RegisterFormValues = z.infer<typeof registerSchema>;
