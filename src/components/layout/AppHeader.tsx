import { Avatar, Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { LogoutOutlined, MenuOutlined } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/text';

interface AppHeaderProps {
  /** Abre el menú lateral en celular */
  onOpenMenu: () => void;
}

/** Menú superior en responsive de celular*/
export const AppHeader = ({ onOpenMenu }: AppHeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: 2, px: { xs: 2, md: 4 }, py: 2 }}>
      <IconButton onClick={onOpenMenu} aria-label="Abrir menú" sx={{ display: { md: 'none' } }}>
        <MenuOutlined />
      </IconButton>

      <Box sx={{ flex: 1 }} />

      {user && (
        <Stack
          direction="row"
          spacing={1.25}
          sx={{
            alignItems: 'center',
            bgcolor: 'background.paper',
            border: 'var(--rg-border)',
            borderRadius: 999,
            py: 0.75,
            pl: 0.75,
            pr: { xs: 0.75, sm: 2 },
          }}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: 14, fontWeight: 800 }}>
            {getInitials(user.name)}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, lineHeight: 1.2 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{user.name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              Rol: {user.role}
            </Typography>
          </Box>
        </Stack>
      )}

      <Button variant="outlined" startIcon={<LogoutOutlined />} onClick={logout}>
        Cerrar sesión
      </Button>
    </Box>
  );
};