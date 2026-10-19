import type { ReactNode } from 'react';
import { Box, Button, Dialog, Stack, Typography } from '@mui/material';
import { DeleteOutlined, HelpOutlined } from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Modal sweet alert para confirmación*/
export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const isDanger = tone === 'danger';
  const Icon = isDanger ? DeleteOutlined : HelpOutlined;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', p: 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isDanger ? 'error.light' : 'primary.light',
            color: isDanger ? 'error.main' : 'primary.main',
          }}
        >
          <Icon sx={{ fontSize: 40 }} aria-hidden />
        </Box>
        <Typography id="confirm-dialog-title" variant="h2">
          {title}
        </Typography>
        <Typography id="confirm-dialog-description" component="div" variant="body1" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ width: '100%', pt: 1 }}>
          <Button fullWidth variant="text" color="inherit" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button fullWidth variant="contained" color={isDanger ? 'error' : 'primary'} onClick={onConfirm} disabled={loading}>
            {loading ? 'Procesando…' : confirmLabel}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};