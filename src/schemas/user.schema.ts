import { z } from 'zod';
import { USER_ROLES } from '../models/user.model';
import { EMAIL_REGEX, NAME_REGEX } from './patterns';

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const PASSWORD_MIN = 8;

export const buildUserFormSchema = (isEdit: boolean) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, 'El nombre es obligatorio')
      .max(NAME_MAX, `El nombre puede tener máximo ${NAME_MAX} caracteres`)
      .regex(NAME_REGEX, 'El nombre solo admite letras, espacios y acentos'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, 'El email es obligatorio')
      .max(EMAIL_MAX, `El email puede tener máximo ${EMAIL_MAX} caracteres`)
      .regex(EMAIL_REGEX, 'Ingresa un correo válido, por ejemplo nombre@correo.com'),
    role: z.enum(USER_ROLES, { message: 'El rol debe ser ADMIN o USER' }),
    password: z
      .string()
      .refine(
        (value) => (isEdit && value === '') || value.length >= PASSWORD_MIN,
        isEdit ? `Déjala vacía para no cambiarla, o usa mínimo ${PASSWORD_MIN} caracteres` : `La contraseña debe tener mínimo ${PASSWORD_MIN} caracteres`,
      ),
  });

export type UserFormValues = z.infer<ReturnType<typeof buildUserFormSchema>>;