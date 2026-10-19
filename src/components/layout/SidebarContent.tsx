import { Box, IconButton, List, ListItemButton, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from '@mui/icons-material';import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { NAV_ITEMS } from './nav-items';
import logo from '../../assets/logo-mark.svg';

interface SidebarContentProps {
  /** true: muestra textos; false: solo íconos */
  expanded: boolean;
  pinned?: boolean;
  onTogglePinned?: () => void;
  onNavigate?: () => void;
}

/** Menú: logo, opciones según el rol y botón para fijar el menú */
export const SidebarContent = ({ expanded, pinned = false, onTogglePinned, onNavigate }: SidebarContentProps) => {
  const { user } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.roles || (user !== null && item.roles.includes(user.role)));

  return (
    <Stack sx={{ height: '100%', py: 3, px: 1.5, gap: 3 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 0.5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            flex: 'none',
            borderRadius: 'var(--rg-radius-md)',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box component="img" src={logo} alt="" sx={{ width: 38, height: 38 }} />
        </Box>
        {expanded && (
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>Registree</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.85, whiteSpace: 'nowrap' }}>
              Inventario gerencial
            </Typography>
          </Box>
        )}
      </Stack>

      <List component="nav" aria-label="Menú principal" sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, p: 0 }}>
        {items.map(({ label, path, Icon }) => (
          <ListItemButton
            key={path}
            component={NavLink}
            to={path}
            end={path === PATHS.dashboard}
            onClick={onNavigate}
            aria-label={label}
            sx={{
              minHeight: 48,
              gap: 1.5,
              px: 1.75,
              borderRadius: 'var(--rg-radius-md)',
              color: 'rgba(255, 255, 255, 0.85)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)', color: 'common.white' },
              '&.active': { bgcolor: 'background.paper', color: 'primary.main' },
            }}
          >
            <Icon />
            {expanded && <ListItemText primary={label} slotProps={{ primary: { sx: { fontWeight: 700, whiteSpace: 'nowrap' } } }} />}
          </ListItemButton>
        ))}
      </List>

      {onTogglePinned && (
        <Box sx={{ mt: 'auto', px: 0.5 }}>
            <Tooltip title={pinned ? 'Contraer menú' : 'Mantener menú abierto'} placement="right">
            <IconButton
                onClick={onTogglePinned}
                aria-label={pinned ? 'Contraer menú' : 'Mantener menú abierto'}
                aria-pressed={pinned}
                size="medium"
                sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'common.white', bgcolor: 'rgba(255, 255, 255, 0.12)' } }}
            >
                {pinned ? <KeyboardDoubleArrowLeftRounded fontSize="small" /> : <KeyboardDoubleArrowRightRounded fontSize="small" />}
            </IconButton>
            </Tooltip>
        </Box>
        )}
    </Stack>
  );
};