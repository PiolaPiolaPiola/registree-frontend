import { useEffect, useState } from 'react';

/**Para no consultar cada que se escriba, se usa un delay*/
export const useDebouncedValue = <T>(value: T, delay = 400): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
};