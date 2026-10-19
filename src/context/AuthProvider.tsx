import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '../api/auth.api';
import { setUnauthorizedHandler } from '../api/http-client';
import type { LoginDTO } from '../models/auth.model';
import type { User } from '../models/user.model';
import { tokenStorage } from '../utils/token-storage';
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

/**Para mantener la sesión viva*/
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    tokenStorage.get() ? 'checking' : 'unauthenticated',
  );

  /** Limpia la sesión*/
  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  /** Valida las credenciales, guarda el token y el usuario*/
  const login = useCallback(async (dto: LoginDTO) => {
    const { token, user: loggedUser } = await authApi.login(dto);
    tokenStorage.set(token);
    setUser(loggedUser);
    setStatus('authenticated');
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
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
    () => ({ user, status, isAdmin: user?.role === 'ADMIN', login, logout }),
    [user, status, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};