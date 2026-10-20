import type { ReactNode } from 'react';
import { Box, Card, CardContent, IconButton, Stack, Tooltip, Typography, type SxProps, type Theme } from '@mui/material';
import { CloseFullscreenRounded, InfoOutlined, OpenInFullRounded } from '@mui/icons-material';

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  /** Texto de ayuda que se muestra al pasar el mouse sobre el ícono de información */
  info?: string;
  /** Si no se envía onToggle, no se puede expandir */
  expanded?: boolean;
  onToggle?: () => void;
  /** Contenido siempre visible */
  children: ReactNode;
  /** Contenido adicional que solo se muestra al expandir */
  details?: ReactNode;
  sx?: SxProps<Theme>;
}

/** Opcionalmente se puede expandir para ver la métrica en detalle */
export const ExpandableCard = ({
  title,
  subtitle,
  icon,
  info,
  expanded = false,
  onToggle,
  children,
  details,
  sx,
}: ExpandableCardProps) => (
  <Card
    sx={[
      { display: 'flex', flexDirection: 'column', minWidth: 0, borderColor: expanded ? 'secondary.main' : undefined },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, p: 2.5, '&:last-child': { pb: 2.5 } }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        {icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              flex: 'none',
              borderRadius: 'var(--rg-radius-md)',
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="h3" component="h2">
              {title}
            </Typography>
            {info && (
              <Tooltip title={info}>
                <IconButton size="small" aria-label={`Información sobre ${title}`} sx={{ width: 28, height: 28, color: 'text.secondary' }}>
                  <InfoOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          {subtitle && <Typography variant="body2">{subtitle}</Typography>}
        </Box>
        {onToggle && (
          <Tooltip title={expanded ? 'Contraer' : 'Expandir'}>
            <IconButton
              onClick={onToggle}
              aria-label={`${expanded ? 'Contraer' : 'Expandir'} ${title}`}
              aria-expanded={expanded}
              sx={{ border: 'var(--rg-border)', color: 'primary.main' }}
            >
              {expanded ? <CloseFullscreenRounded fontSize="small" /> : <OpenInFullRounded fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {children}

      {expanded && details && <Box sx={{ pt: 2, borderTop: 'var(--rg-border)' }}>{details}</Box>}
    </CardContent>
  </Card>
);