import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from '../context/auth-context';

/** Acceso a la sesión desde cualquier componente */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};