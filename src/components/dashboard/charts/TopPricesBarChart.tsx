import { Box } from '@mui/material';
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Product } from '../../../models/product.model';
import { CHART_COLORS } from '../../../styles/chart-colors';
import { formatCurrency } from '../../../utils/format';

interface TopPricesBarChartProps {
  products: Product[];
  height?: number;
  compact?: boolean;
}

const shortenLabel = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;

/** Barras horizontales con los productos más caros*/
export const TopPricesBarChart = ({ products, height = 240, compact = false }: TopPricesBarChartProps) => {
  const labelWidth = compact ? 110 : 190;
  const maxLabelLength = compact ? 13 : 22;
  const data = products.map((product) => ({ title: product.title, price: product.price }));
  const summary = data.map((item) => `${item.title}: ${formatCurrency(item.price)}`).join(', ');

  return (
    <Box role="img" aria-label={`Productos más caros. ${summary}`} sx={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: compact ? 84 : 96, bottom: 4, left: 4 }}>
          <XAxis type="number" hide domain={[0, 'dataMax']} />
          <YAxis
            type="category"
            dataKey="title"
            width={labelWidth}
            tickLine={false}
            axisLine={false}
            tickFormatter={(text: string) => shortenLabel(text, maxLabelLength)}
            tick={{ fill: '#33475B', fontSize: 13, fontWeight: 700 }}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), 'Precio']}
            cursor={{ fill: '#EAF6FC' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #D6E6F2', fontWeight: 700 }}
          />
          <Bar dataKey="price" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
            <LabelList
              dataKey="price"
              position="right"
              formatter={(value) => formatCurrency(Number(value))}
              style={{ fill: '#0F2A44', fontSize: 13, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};