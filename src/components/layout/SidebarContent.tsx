import { Box, ButtonBase, IconButton, List, ListItemButton, ListItemText, Stack, Tooltip, Typography } from '@mui/material';
import { KeyboardDoubleArrowLeftRounded, KeyboardDoubleArrowRightRounded } from '@mui/icons-material';
import { Link as RouterLink, NavLink } from 'react-router-dom';
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

/**
 * Menú: logo, opciones según el rol y botón para contraer o mantener abierto.
 */
export const SidebarContent = ({ expanded, pinned = false, onTogglePinned, onNavigate }: SidebarContentProps) => {
  const { user } = useAuth();
  const items = NAV_ITEMS.filter((item) => !item.roles || (user !== null && item.roles.includes(user.role)));

  return (
    <Stack sx={{ height: '100%', py: 3, px: 1.5, gap: 3 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 0.75 }}>
        {/* El logo lleva al inicio (dashboard) */}
        <ButtonBase
          component={RouterLink}
          to={PATHS.dashboard}
          onClick={onNavigate}
          aria-label="Ir al inicio"
          sx={{
            '&:focus-visible': { outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: 2 },
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
        </ButtonBase>
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
              px: 2.25,
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
        <Box sx={{ mt: 'auto', mx: -1.5, width: 'var(--rg-sidebar-width-collapsed)', display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={pinned ? 'Contraer menú' : 'Mantener menú abierto'} placement="right">
            <IconButton
              onClick={onTogglePinned}
              aria-label={pinned ? 'Contraer menú' : 'Mantener menú abierto'}
              aria-pressed={pinned}
              sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'common.white', bgcolor: 'rgba(255, 255, 255, 0.12)' } }}
            >
              {pinned ? <KeyboardDoubleArrowLeftRounded /> : <KeyboardDoubleArrowRightRounded />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Stack>
  );
};