import { http } from './http-client';
import type { AuthMe, LoginDTO, LoginResponse } from '../models/auth.model';

/** POST /auth/login: valida las credenciales y devuelve el token y el usuario */
export const login = async (dto: LoginDTO): Promise<LoginResponse> => {
  const { data } = await http.post<LoginResponse>('/auth/login', dto);
  return data;
};

/** GET /auth/me: valida el token actual y devuelve el usuario */
export const getMe = async (): Promise<AuthMe> => {
  const { data } = await http.get<AuthMe>('/auth/me');
  return data;
};