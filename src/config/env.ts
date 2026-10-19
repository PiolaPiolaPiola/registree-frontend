type EnvVar = 'VITE_API_URL';

const required = (name: EnvVar): string => {
    const value = import.meta.env[name];
    if (!value){
        throw new Error(`Falta la variable de entorno ${name}`);
    }
    return value;
}

/**Para validar que las variables de entorno requeridas existan */
export const env = {
  apiUrl: required('VITE_API_URL'),
} as const;