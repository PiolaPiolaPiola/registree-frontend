import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '../api/auth.api';
import { setUnauthorizedHandler } from '../api/http-client';
import type { LoginDTO, LoginResponse, RegisterDTO } from '../models/auth.model';
import type { User } from '../models/user.model';
import { tokenStorage } from '../utils/token-storage';
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

/**Para mantener la sesión viva*/
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionEndedByUser, setSessionEndedByUser] = useState(false);
  const [status, setStatus] = useState<AuthStatus>(() =>
    tokenStorage.get() ? 'checking' : 'unauthenticated',
  );

  /** Limpia la sesión*/
  const logout = useCallback((byUser = true) => {
    tokenStorage.clear();
    setUser(null);
    setStatus('unauthenticated');
    setSessionEndedByUser(byUser);
  }, []);

  /** Guarda el token y el usuario que devuelven el login y el registro */
  const startSession = useCallback(({ token, user: loggedUser }: LoginResponse) => {
    tokenStorage.set(token);
    setUser(loggedUser);
    setStatus('authenticated');
    setSessionEndedByUser(false);
  }, []);

  /** Valida las credenciales, guarda el token y el usuario*/
  const login = useCallback(async (dto: LoginDTO) => startSession(await authApi.login(dto)), [startSession]);

  /** Crea la cuenta y deja la sesión iniciada */
  const register = useCallback(async (dto: RegisterDTO) => startSession(await authApi.register(dto)), [startSession]);

  useEffect(() => {
    // Token vencido o usuario inactivado, se guarda la ruta para volver a ella después de iniciar sesión
    setUnauthorizedHandler(() => logout(false));
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    if (!tokenStorage.get()) return;

    let cancelled = false;
    authApi
      .getMe()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setStatus('unauthenticated');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, isAdmin: user?.role === 'ADMIN', login, register, logout, sessionEndedByUser }),
    [user, status, login, register, logout, sessionEndedByUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};