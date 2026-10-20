import { Box, Stack, Tooltip as MuiTooltip, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategorySummary } from '../../../models/metrics.model';
import { CHART_COLORS, OTHER_COLOR, OTHER_SHADES, getCategoryColor } from '../../../styles/chart-colors';
import { formatNumber, formatPercent } from '../../../utils/format';

interface CategoryDonutChartProps {
  categories: CategorySummary[];
  /** Alto del gráfico en px cuando la tarjeta está expandida */
  height?: number;
  /** Posición de la leyenda debajo en la tarjeta normal y a la derecha cuando está expandida */
  legendPosition?: 'bottom' | 'right';
}

/** Porción de la dona: una por categoría */
interface Slice {
  name: string;
  value: number;
  color: string;
  /** true si la categoría está agrupada en Otras dentro del tooltip */
  grouped: boolean;
}

/**
 * La dona muestra todas las categorías. Si no caben se listan en el tooltip
 * para que la tarjeta no crezca sin límite.
 */
export const CategoryDonutChart = ({ categories, height = 220, legendPosition = 'bottom' }: CategoryDonutChartProps) => {
  const totalProducts = categories.reduce((total, category) => total + category.productCount, 0);
  const percentOf = (value: number) => formatPercent(totalProducts ? value / totalProducts : 0);

  // las que queden como otras, se ven de color gris
  const hasOthers = categories.length > CHART_COLORS.length;
  const visible = hasOthers ? categories.slice(0, CHART_COLORS.length - 1) : categories;
  const others = hasOthers ? categories.slice(CHART_COLORS.length - 1) : [];
  const names = visible.map((category) => category.category);
  const othersTotal = others.reduce((total, category) => total + category.productCount, 0);

  const slices: Slice[] = [
    ...visible.map((category) => ({
      name: category.category,
      value: category.productCount,
      color: getCategoryColor(category.category, names),
      grouped: false,
    })),
    // Dos grises diferentes por si dos categorías de otras quedan juntas en la gráfica 
    ...others.map((category, index) => ({
      name: category.category,
      value: category.productCount,
      color: OTHER_SHADES[index % OTHER_SHADES.length],
      grouped: true,
    })),
  ];

  const summary = slices.map((slice) => `${slice.name}: ${slice.value}`).join(', ');

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
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              stroke="#FFFFFF"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {slices.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              wrapperStyle={{ zIndex: 2 }}
              content={({ active, payload }) => {
                const slice = payload?.[0]?.payload as Slice | undefined;
                if (!active || !slice) return null;
                return (
                  <Box sx={{ bgcolor: 'background.paper', border: '1px solid #D6E6F2', borderRadius: '12px', px: 1.5, py: 1, boxShadow: 'var(--rg-shadow-card)' }}>
                    <Typography sx={{ fontWeight: 800 }}>{slice.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatNumber(slice.value)} {slice.value === 1 ? 'producto' : 'productos'} · {percentOf(slice.value)}
                    </Typography>
                    {slice.grouped && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Agrupada en "Otras"
                      </Typography>
                    )}
                  </Box>
                );
              }}
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
        {slices
          .filter((slice) => !slice.grouped)
          .map((slice) => (
            <Stack component="li" key={slice.name} direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '4px', bgcolor: slice.color, flex: 'none' }} aria-hidden />
              <Typography sx={{ flex: 1, fontWeight: 700, minWidth: 0 }} noWrap>
                {slice.name}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                {formatNumber(slice.value)} · {percentOf(slice.value)}
              </Typography>
            </Stack>
          ))}
        {hasOthers && (
          <Stack component="li" direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '4px', bgcolor: OTHER_COLOR, flex: 'none' }} aria-hidden />
            <Stack direction="row" spacing={0.5} sx={{ flex: 1, minWidth: 0, alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 700 }} noWrap>
                Otras ({others.length})
              </Typography>
              <MuiTooltip
                title={
                  <Stack component="ul" spacing={0.25} sx={{ listStyle: 'none', m: 0, p: 0 }}>
                    {others.map((category) => (
                      <li key={category.category}>
                        {category.category}: {formatNumber(category.productCount)} · {percentOf(category.productCount)}
                      </li>
                    ))}
                  </Stack>
                }
              >
                <InfoOutlined
                  tabIndex={0}
                  aria-label={`Categorías agrupadas en Otras: ${others.map((category) => category.category).join(', ')}`}
                  sx={{ fontSize: 18, color: 'text.secondary', cursor: 'help' }}
                />
              </MuiTooltip>
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
              {formatNumber(othersTotal)} · {percentOf(othersTotal)}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
