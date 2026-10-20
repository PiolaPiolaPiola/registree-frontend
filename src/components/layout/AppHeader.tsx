import { Avatar, Box, Button, ButtonBase, IconButton, Typography, type SxProps, type Theme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LogoutOutlined, MenuOutlined } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/text';
import { PATHS } from '../../routes/paths';

interface AppHeaderProps {
  /** Abre el menú lateral en celular */
  onOpenMenu: () => void;
}

/** Estilo de la tarjeta de perfil del encabezado */
const profileSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
  bgcolor: 'background.paper',
  border: 'var(--rg-border)',
  borderRadius: 999,
  py: 0.75,
  pl: 0.75,
  pr: { xs: 0.75, sm: 2 },
  textAlign: 'left',
  '&:focus-visible': { outline: '2px solid', outlineColor: 'secondary.main', outlineOffset: 2 },
};

/** Menú superior en responsive de celular*/
export const AppHeader = ({ onOpenMenu }: AppHeaderProps) => {
  const { user, isAdmin, logout } = useAuth();

  // El ADMIN puede hacer clic en su perfil para ir a la administración de usuarios
  const profile = user && (
    <>
      <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: 14, fontWeight: 800 }}>{getInitials(user.name)}</Avatar>
      <Box sx={{ display: { xs: 'none', sm: 'block' }, lineHeight: 1.2 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{user.name}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
          Rol: {user.role}
        </Typography>
      </Box>
    </>
  );

  return (
    <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: 2, px: { xs: 2, md: 4 }, py: 2 }}>
      <IconButton onClick={onOpenMenu} aria-label="Abrir menú" sx={{ display: { md: 'none' } }}>
        <MenuOutlined />
      </IconButton>

      <Box sx={{ flex: 1 }} />

      {user &&
        (isAdmin ? (
          <ButtonBase component={RouterLink} to={PATHS.users} aria-label="Ir a la administración de usuarios" sx={profileSx}>
            {profile}
          </ButtonBase>
        ) : (
          <Box sx={profileSx}>{profile}</Box>
        ))}

      <Button variant="outlined" startIcon={<LogoutOutlined />} onClick={logout}>
        Cerrar sesión
      </Button>
    </Box>
  );
};