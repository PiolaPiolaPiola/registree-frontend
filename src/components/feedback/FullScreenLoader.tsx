import { LoadingState } from './LoadingState';

interface FullScreenLoaderProps {
  message?: string;
}

/** Carga a pantalla completa. Se usa mientras se valida la sesión */
export const FullScreenLoader = ({ message }: FullScreenLoaderProps) => <LoadingState message={message} minHeight="100vh" />;