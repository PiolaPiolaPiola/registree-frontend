import { Box, Stack, Typography } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategorySummary } from '../../../models/metrics.model';
import { getCategoryColor } from '../../../styles/chart-colors';
import { formatNumber, formatPercent } from '../../../utils/format';

interface CategoryDonutChartProps {
  categories: CategorySummary[];
  /** Alto del gráfico en px cuando la tarjeta está expandida */
  height?: number;
  /** Posición de la leyenda debajo en la tarjeta normal y a la derecha cuando está expandida */
  legendPosition?: 'bottom' | 'right';
}

/** Gráfico de dona con proporción de productos por categoría, con leyenda que muestra cantidad y porcentaje */
export const CategoryDonutChart = ({ categories, height = 220, legendPosition = 'bottom' }: CategoryDonutChartProps) => {
  const totalProducts = categories.reduce((total, category) => total + category.productCount, 0);
  const names = categories.map((category) => category.category);
  const data = categories.map((category) => ({
    name: category.category,
    value: category.productCount,
    color: getCategoryColor(category.category, names),
  }));

  const summary = data.map((item) => `${item.name}: ${item.value}`).join(', ');

  return (
    <Stack direction={legendPosition === 'right' ? { xs: 'column', sm: 'row' } : 'column'} spacing={3} sx={{ alignItems: 'center' }}>
      <Box
        role="img"
        aria-label={`Productos por categoría. ${summary}`}
        sx={{ position: 'relative', width: '100%', maxWidth: height, height, flex: 'none' }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              stroke="#FFFFFF"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${formatNumber(Number(value))} productos`, '']}
              separator=""
              contentStyle={{ borderRadius: 12, border: '1px solid #D6E6F2', fontWeight: 700 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <Typography sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{formatNumber(totalProducts)}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
            productos
          </Typography>
        </Box>
      </Box>

      <Stack component="ul" spacing={1.25} sx={{ listStyle: 'none', m: 0, p: 0, width: '100%', minWidth: 0 }}>
        {data.map((item) => (
          <Stack component="li" key={item.name} direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '4px', bgcolor: item.color, flex: 'none' }} aria-hidden />
            <Typography sx={{ flex: 1, fontWeight: 700, minWidth: 0 }} noWrap>
              {item.name}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
              {formatNumber(item.value)} · {formatPercent(totalProducts ? item.value / totalProducts : 0)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};