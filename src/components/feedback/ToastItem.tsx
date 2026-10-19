import { useEffect } from 'react';
import { Grow, IconButton, Paper, Typography } from '@mui/material';
import { CheckCircleOutlined, Close, ErrorOutlined, InfoOutlined } from '@mui/icons-material';
import type { Toast, ToastSeverity } from '../../context/toast-context';

const AUTO_CLOSE_MS = 4500;

const TOAST_STYLES: Record<ToastSeverity, { bgcolor: string; color: string; borderColor: string; Icon: typeof InfoOutlined }> = {
  success: { bgcolor: 'success.light', color: 'success.dark', borderColor: 'success.main', Icon: CheckCircleOutlined },
  error: { bgcolor: 'error.light', color: 'error.dark', borderColor: 'error.main', Icon: ErrorOutlined },
  info: { bgcolor: 'primary.main', color: 'primary.contrastText', borderColor: 'primary.main', Icon: InfoOutlined },
};

interface ToastItemProps {
  toast: Toast;
  onClose: (id: number) => void;
}

/** La notificación se cierra sola después de unos segundos o con el botón de cerrar */
export const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const { bgcolor, color, borderColor, Icon } = TOAST_STYLES[toast.severity];

  useEffect(() => {
    const timer = window.setTimeout(() => onClose(toast.id), AUTO_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <Grow in>
      <Paper
        role={toast.severity === 'error' ? 'alert' : 'status'}
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minHeight: 56,
          width: { xs: 'calc(100vw - 32px)', sm: 420 },
          pl: 2,
          pr: 1,
          py: 1,
          bgcolor,
          color,
          border: '1.5px solid',
          borderColor,
          borderRadius: 'var(--rg-radius-lg)',
          boxShadow: 'var(--rg-shadow-floating)',
        }}
      >
        <Icon aria-hidden />
        <Typography sx={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{toast.message}</Typography>
        <IconButton onClick={() => onClose(toast.id)} aria-label="Cerrar notificación" sx={{ color: 'inherit' }}>
          <Close fontSize="small" />
        </IconButton>
      </Paper>
    </Grow>
  );
};