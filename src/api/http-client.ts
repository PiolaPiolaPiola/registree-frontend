import axios from 'axios';
import { env } from '../config/env';
import { tokenStorage } from '../utils/token-storage';
import { toApiError } from './api-error';

let onUnauthorized: (() => void) | null = null;

/** Cuando alguien no está autenticado, recibe la acción a realizar. */
export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  onUnauthorized = handler;
};

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Solo aplica en desarrollo y si VITE_API_DELAY_MS está definida, retrasa las peticiones para ver los spinners
if (env.apiDelayMs > 0) {
  http.interceptors.request.use(async (config) => {
    await new Promise((resolve) => window.setTimeout(resolve, env.apiDelayMs));
    return config;
  });
}

// Agrega el token a cada petición
http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);
    // En el login si hay error de autenticación, no se cierra sesión porque no hay
    const isLoginRequest = axios.isAxiosError(error) && error.config?.url === '/auth/login';
    if (apiError.status === 401 && !isLoginRequest) {
      onUnauthorized?.();
    }
    return Promise.reject(apiError);
  },
);