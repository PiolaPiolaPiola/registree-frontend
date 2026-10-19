import { http } from './http-client';
import type { PaginatedResult } from '../models/pagination.model';
import type { CreateUserDTO, UpdateUserDTO, User, UserFilters } from '../models/user.model';

/** GET /users: listado paginado con filtro por estado*/
export const getUsers = async (filters: UserFilters = {}): Promise<PaginatedResult<User>> => {
  const { data } = await http.get<PaginatedResult<User>>('/users', { params: filters });
  return data;
};

/** GET /users/:id: detalle de un usuario */
export const getUserById = async (id: string): Promise<User> => {
  const { data } = await http.get<User>(`/users/${id}`);
  return data;
};

/** POST /users: crea un usuario con el rol seleccionado */
export const createUser = async (dto: CreateUserDTO): Promise<User> => {
  const { data } = await http.post<User>('/users', dto);
  return data;
};

/** PATCH /users/:id: actualiza solo los campos enviados */
export const updateUser = async (id: string, dto: UpdateUserDTO): Promise<User> => {
  const { data } = await http.patch<User>(`/users/${id}`, dto);
  return data;
};

/** PATCH /users/:id/status: activa o desactiva un usuario */
export const setUserStatus = async (id: string, active: boolean): Promise<User> => {
  const { data } = await http.patch<User>(`/users/${id}/status`, { active });
  return data;
};