type EnvVar = 'VITE_API_URL';

const required = (name: EnvVar): string => {
    const value = import.meta.env[name];
    if (!value){
        throw new Error(`Falta la variable de entorno ${name}`);
    }
    return value;
}

/** Retraso falso (en ms) para ver desde modo Dev el spinner de carga. En otro entorno, ms es 0.
 */
const readApiDelay = (): number => {
  if (!import.meta.env.DEV) return 0;
  const delay = Number(import.meta.env.VITE_API_DELAY_MS);
  return Number.isFinite(delay) && delay > 0 ? delay : 0;
};

/**Para validar que las variables de entorno requeridas existan */
export const env = {
  apiUrl: required('VITE_API_URL'),
  apiDelayMs: readApiDelay(),
} as const;