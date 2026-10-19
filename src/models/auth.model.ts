import type { User } from './user.model';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// export interface AuthMe { //Para consultar persona autenticada
//   sub: string;
//   role: UserRole;
// }