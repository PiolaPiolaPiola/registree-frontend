import { useCallback, useEffect, useState } from 'react';

const PINNED_KEY = 'registree.sidebarPinned';

/** Busca la preferencia de fijado guardada. Por defecto el menú está fijado */
const readPinned = (): boolean => {
  try {
    return localStorage.getItem(PINNED_KEY) !== 'false';
  } catch {
    return true;
  }
};

/** Estado del menú lateral fijado o no. Se guarda en session*/
export const useSidebarPin = () => {
  const [pinned, setPinned] = useState<boolean>(readPinned);

  useEffect(() => {
    try {
      localStorage.setItem(PINNED_KEY, String(pinned));
    } catch {
      // Para evitar que estalle la app sin catch
    }
  }, [pinned]);

  const togglePinned = useCallback(() => setPinned((current) => !current), []);

  return { pinned, togglePinned };
};