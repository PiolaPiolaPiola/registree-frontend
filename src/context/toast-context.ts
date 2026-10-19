import { createContext } from 'react';

export type ToastSeverity = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  severity: ToastSeverity;
}

export interface ToastContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);