import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { Stack } from '@mui/material';
import { ToastItem } from '../components/feedback/ToastItem';
import { ToastContext, type Toast, type ToastContextValue, type ToastSeverity } from './toast-context';

const MAX_VISIBLE_TOASTS = 3;

interface ToastProviderProps {
  children: ReactNode;
}

/** Se puede usar los toast en toda la app*/
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, severity: ToastSeverity) => {
    nextId.current += 1;
    const toast: Toast = { id: nextId.current, message, severity };
    // Se conservan solo las más recientes para no tapar la pantalla
    setToasts((current) => [...current, toast].slice(-MAX_VISIBLE_TOASTS));
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      showSuccess: (message) => addToast(message, 'success'),
      showError: (message) => addToast(message, 'error'),
      showInfo: (message) => addToast(message, 'info'),
    }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Stack
        aria-live="polite"
        spacing={1.5}
        sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: (theme) => theme.zIndex.snackbar }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </Stack>
    </ToastContext.Provider>
  );
};