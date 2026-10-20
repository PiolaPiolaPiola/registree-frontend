import { useState, type FocusEvent } from 'react';
import { Box } from '@mui/material';
import { SidebarContent } from './SidebarContent';

interface SidebarProps {
  pinned: boolean;
  onTogglePinned: () => void;
}

export const Sidebar = ({ pinned, onTogglePinned }: SidebarProps) => {
  const [hovered, setHovered] = useState(false);
  // Justo después de contraer, el mouse sigue encima: se ignora el hover hasta que salga del menú
  const [hoverLocked, setHoverLocked] = useState(false);
  const expanded = pinned || (hovered && !hoverLocked);

  const handleTogglePinned = () => {
    if (pinned) {
      setHoverLocked(true);
    }
    onTogglePinned();
  };

  /** Al salir del menú con el mouse se contrae y el hover vuelve a funcionar */
  const resetHover = () => {
    setHovered(false);
    setHoverLocked(false);
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      resetHover();
    }
  };

  return (
    <Box
      component="aside"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={resetHover}
      onFocus={() => setHovered(true)}
      onBlur={handleBlur}
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: (theme) => theme.zIndex.drawer,
        width: expanded ? 'var(--rg-sidebar-width)' : 'var(--rg-sidebar-width-collapsed)',
        transition: 'width 200ms ease, box-shadow 200ms ease',
        overflow: 'hidden',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        boxShadow: !pinned && expanded ? 'var(--rg-shadow-floating)' : 'none',
      }}
    >
      <SidebarContent expanded={expanded} pinned={pinned} onTogglePinned={handleTogglePinned} />
    </Box>
  );
};