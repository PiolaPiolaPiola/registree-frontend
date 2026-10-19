import axios from 'axios';
import type { ApiErrorResponse } from '../models/api-error.model';

/**Estándar de error*/
export class ApiError extends Error {
  readonly status: number;
  readonly errors: string[];

  constructor(status: number, message: string, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const isApiErrorResponse = (data: unknown): data is ApiErrorResponse =>
  typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string';

/** Para convertir un error de una petición en un ApiError y conservar estándar */
export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new ApiError(0, 'No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.');
    }
    const { status, data } = error.response;
    if (isApiErrorResponse(data)) {
      return new ApiError(status, data.message, data.errors ?? []);
    }
    return new ApiError(status, 'Ocurrió un error inesperado. Intenta de nuevo.');
  }

  return new ApiError(0, 'Ocurrió un error inesperado. Intenta de nuevo.');
};