import { createContext } from 'react';
import type { LoginDTO, RegisterDTO } from '../models/auth.model';
import type { User } from '../models/user.model';

/**Estado de la sesión:*/
export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  isAdmin: boolean;
  login: (dto: LoginDTO) => Promise<void>;
  /** Crea la cuenta como USER por defecto e inicia sesión*/
  register: (dto: RegisterDTO) => Promise<void>;
  logout: (byUser?: boolean) => void;
  /** true si la sesión la cerró el usuario,el login no debe volver a la ruta anterior*/
  sessionEndedByUser: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);