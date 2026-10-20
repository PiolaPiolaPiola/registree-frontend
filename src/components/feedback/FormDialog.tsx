import type { FormEventHandler, ReactNode } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';

interface FormDialogProps {
  open: boolean;
  title: string;
  subtitle?: string;
  /** Texto del botón principal: "Crear producto", "Guardar cambios" */
  submitLabel: string;
  submitting?: boolean;
  /** Deshabilita el botón principal. Para usar durante una petición*/
  submitDisabled?: boolean;
  /** Solo lectura, para la vista de detalle*/
  readOnly?: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
}

/**Modal genérico para formularios. Reutilizable*/
export const FormDialog = ({
  open,
  title,
  subtitle,
  submitLabel,
  submitting = false,
  submitDisabled = false,
  readOnly = false,
  onClose,
  onSubmit,
  children,
  maxWidth = 'sm',
}: FormDialogProps) => (
  <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth={maxWidth} fullWidth aria-labelledby="form-dialog-title">
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <DialogTitle id="form-dialog-title" sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pr: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" component="span" sx={{ display: 'block' }}>
            {title}
          </Typography>
          {subtitle && <Typography variant="body2">{subtitle}</Typography>}
        </Box>
        <IconButton onClick={onClose} disabled={submitting} aria-label="Cerrar">
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant={readOnly ? 'contained' : 'text'} color={readOnly ? 'primary' : 'inherit'} onClick={onClose} disabled={submitting}>
          {readOnly ? 'Cerrar' : 'Cancelar'}
        </Button>
        {!readOnly && (
          <Button type="submit" variant="contained" disabled={submitting || submitDisabled}>
            {submitting ? 'Guardando…' : submitLabel}
          </Button>
        )}
      </DialogActions>
    </Box>
  </Dialog>
);