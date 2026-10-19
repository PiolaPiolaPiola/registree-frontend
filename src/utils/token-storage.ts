const TOKEN_KEY = 'registree.token';

/**Guarda el token de sesión en local para restaurar la sesión al recargar la página.*/
export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // Sin almacenamiento disponible la sesión no se conserva al recargar. 
      //El catch evita que se caiga la app
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Sin almacenamiento disponible no hay nada para borrar
      //El catch evita que se caiga la app
    }
  },
};