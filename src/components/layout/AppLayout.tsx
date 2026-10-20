import { useState } from 'react';
import { Box, Drawer } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSidebarPin } from '../../hooks/useSidebarPin';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import { SidebarContent } from './SidebarContent';

export const AppLayout = () => {
  const { pinned, togglePinned } = useSidebarPin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Sidebar pinned={pinned} onTogglePinned={togglePinned} />

      <Drawer
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        sx={{ display: { md: 'none' } }}
        slotProps={{
          paper: {
            sx: {
              width: 'var(--rg-sidebar-width)',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            },
          },
        }}
      >
        <SidebarContent expanded onNavigate={closeMobileMenu} />
      </Drawer>

      <Box
        sx={{
          ml: { md: pinned ? 'var(--rg-sidebar-width)' : 'var(--rg-sidebar-width-collapsed)' },
          transition: 'margin-left 200ms ease',
          minWidth: 0,
        }}
      >
        <AppHeader onOpenMenu={() => setMobileMenuOpen(true)} />
        <Box component="main" sx={{ px: { xs: 2, md: 4 }, pb: 5 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};