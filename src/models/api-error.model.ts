//Conserva el formato de errores implemntado en el backend
export interface ApiErrorResponse {
  message: string;
  errors?: string[];
}