import type { PaginationParams } from './pagination.model';

export const USER_ROLES = ['ADMIN', 'USER'] as const;
export type UserRole = (typeof USER_ROLES)[number]; // 'ADMIN' | 'USER'

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  creationAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export type UpdateUserDTO = Partial<CreateUserDTO> & {
  active?: boolean;
};

export interface UserFilters extends Partial<PaginationParams> {
  active?: boolean;
}