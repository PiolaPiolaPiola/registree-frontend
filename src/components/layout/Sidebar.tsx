import { useState, type FocusEvent } from 'react';
import { Box } from '@mui/material';
import { SidebarContent } from './SidebarContent';

interface SidebarProps {
  pinned: boolean;
  onTogglePinned: () => void;
}

export const Sidebar = ({ pinned, onTogglePinned }: SidebarProps) => {
  const [hovered, setHovered] = useState(false);
  const expanded = pinned || hovered;

  /** Contrae el menú si no hay hoover*/
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setHovered(false);
    }
  };

  return (
    <Box
      component="aside"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        borderRadius: '0 28px 28px 0',
        boxShadow: !pinned && hovered ? 'var(--rg-shadow-floating)' : 'none',
      }}
    >
      <SidebarContent expanded={expanded} pinned={pinned} onTogglePinned={onTogglePinned} />
    </Box>
  );
};