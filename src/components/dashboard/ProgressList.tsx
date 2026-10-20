import { Box, LinearProgress, Stack, Typography } from '@mui/material';

export interface ProgressItem {
  label: string;
  value: number;
  displayValue: string;
  color: string;
}

interface ProgressListProps {
  title: string;
  items: ProgressItem[];
}

/** Barras horizontales para el detalle de las tarjetas expandidas. El valor mayor ocupa la barra completa */
export const ProgressList = ({ title, items }: ProgressListProps) => {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <Stack spacing={1.75}>
      <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontSize: 14 }}>
        {title}
      </Typography>
      {items.map((item) => (
        <Box key={item.label}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.75, fontWeight: 700 }}>
            <Typography sx={{ fontWeight: 700 }}>{item.label}</Typography>
            <Typography sx={{ fontWeight: 700 }}>{item.displayValue}</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(item.value / maxValue) * 100}
            aria-label={`${item.label}: ${item.displayValue}`}
            sx={{
              height: 12,
              borderRadius: 999,
              bgcolor: '#EEF4F9',
              '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: item.color },
            }}
          />
        </Box>
      ))}
    </Stack>
  );
};