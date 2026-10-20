import { IconButton, Stack, Tooltip } from '@mui/material';
import type { RowAction } from './table.types';

interface RowActionsProps {
  actions: RowAction[];
  /** Deshabilita todos los botones (por ejemplo, mientras otra acción está en curso) */
  disabled?: boolean;
}

export const RowActions = ({ actions, disabled = false }: RowActionsProps) => (
  <Stack direction="row" spacing={0.75} sx={{ justifyContent: 'flex-end' }}>
    {actions.map((action) => (
      <Tooltip key={action.label} title={action.label}>
        <span>
          <IconButton
            size="small"
            color={action.color ?? 'primary'}
            onClick={action.onClick}
            disabled={disabled || action.disabled}
            aria-label={action.label}
            sx={{ border: 'var(--rg-border)' }}
          >
            {action.icon}
          </IconButton>
        </span>
      </Tooltip>
    ))}
  </Stack>
);