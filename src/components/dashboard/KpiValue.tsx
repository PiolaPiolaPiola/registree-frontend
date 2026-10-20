import { Stack, Typography } from '@mui/material';

interface KpiValueProps {
  value: string;
  caption: string;
}

export const KpiValue = ({ value, caption }: KpiValueProps) => (
  <Stack spacing={0.5}>
    <Typography variant="h4" component="p" sx={{ fontSize: { xs: 32, md: 36 }, wordBreak: 'break-word' }}>
      {value}
    </Typography>
    <Typography variant="body2">{caption}</Typography>
  </Stack>
);