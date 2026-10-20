import { useState } from 'react';
import { Box, Button, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { EmojiEventsOutlined, Inventory2Outlined, PaidOutlined, RefreshRounded } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { PageHeader } from '../components/layout/PageHeader';
import { LoadingState } from '../components/feedback/LoadingState';
import { StatusView } from '../components/feedback/StatusView';
import { ExpandableCard } from '../components/dashboard/ExpandableCard';
import { KpiValue } from '../components/dashboard/KpiValue';
import { ProgressList } from '../components/dashboard/ProgressList';
import { getCardGridSx, type DashboardCardId } from '../components/dashboard/dashboard-layout';
import { formatCurrency, formatNumber, formatTime } from '../utils/format';
import { PATHS } from '../routes/paths';
import chartsEmptyImage from '../assets/graficos-vacio.svg';
import inventoryEmptyImage from '../assets/inventario-vacio.svg';
import { CategoryDonutChart } from '../components/dashboard/charts/CategoryDonutChart';
import { TopPricesBarChart } from '../components/dashboard/charts/TopPricesBarChart';

export const DashboardView = () => {
  const { metrics, topExpensive, status, isRefreshing, error, lastUpdated, refresh } = useDashboardMetrics();
  const [expandedId, setExpandedId] = useState<DashboardCardId | null>(null);

  const toggleCard = (id: DashboardCardId) => setExpandedId((current) => (current === id ? null : id));

  if (status === 'loading') {
    return <LoadingState message="Cargando métricas…" />;
  }

  if (status === 'error') {
    return (
      <StatusView
        size="compact"
        image={chartsEmptyImage}
        title="No pudimos cargar las métricas"
        description={error ?? 'Intenta de nuevo en unos segundos.'}
        action={<Button variant="contained" onClick={refresh}>Reintentar</Button>}
      />
    );
  }

  if (metrics.totalProducts === 0) {
    return (
      <StatusView
        size="compact"
        image={inventoryEmptyImage}
        title="Aún no hay productos"
        description="Cuando se registren productos, aquí verás las métricas del inventario."
        action={<Button component={Link} to={PATHS.inventory} variant="contained">Ir al inventario</Button>}
      />
    );
  }

  const { stock, leadingCategory } = metrics;
  const stockByCategory = [...metrics.categories].sort((a, b) => b.totalStock - a.totalStock);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen del inventario activo"
        actions={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {isRefreshing ? (
              <Chip label="Actualizando…" size="small" color="secondary" variant="outlined" />
            ) : (
              lastUpdated && <Typography variant="body2">Actualizado {formatTime(lastUpdated)}</Typography>
            )}
            <Tooltip title="Actualizar métricas">
              <span>
                <IconButton onClick={refresh} disabled={isRefreshing} aria-label="Actualizar métricas" sx={{ border: 'var(--rg-border)' }}>
                  <RefreshRounded />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        }
      />

      <Box
        component="section"
        aria-label="Métricas del inventario"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' },
          gridAutoFlow: 'row dense',
          gap: 2.5,
        }}
      >
        <ExpandableCard
          title="Total de productos"
          icon={<Inventory2Outlined />}
          expanded={expandedId === 'totalProducts'}
          onToggle={() => toggleCard('totalProducts')}
          sx={getCardGridSx('totalProducts', expandedId)}
          details={
            <ProgressList
              title="Estado del stock"
              items={[
                { label: 'Disponibles', value: stock.available, displayValue: formatNumber(stock.available), color: '#8BC34A' },
                { label: 'Poco stock', value: stock.lowStock, displayValue: formatNumber(stock.lowStock), color: '#F2A93B' },
                { label: 'Agotados', value: stock.outOfStock, displayValue: formatNumber(stock.outOfStock), color: '#E57373' },
              ]}
            />
          }
        >
          <KpiValue value={formatNumber(metrics.totalProducts)} caption="productos activos" />
        </ExpandableCard>

        <ExpandableCard
        title="Valor total del inventario"
        icon={<PaidOutlined />}
        info="Suma de precio × stock de todos los productos activos, calculada con precisión decimal."
        sx={getCardGridSx('inventoryValue', expandedId)}
        >
        <KpiValue value={formatCurrency(metrics.inventoryValue)} caption="en pesos colombianos" />
        </ExpandableCard>

        <ExpandableCard
          title="Categoría líder"
          icon={<EmojiEventsOutlined />}
          expanded={expandedId === 'leadingCategory'}
          onToggle={() => toggleCard('leadingCategory')}
          sx={getCardGridSx('leadingCategory', expandedId)}
          details={
            <ProgressList
              title="Unidades en stock por categoría"
              items={stockByCategory.map((category) => ({
                label: category.category,
                value: category.totalStock,
                displayValue: `${formatNumber(category.totalStock)} u.`,
                color: category.category === leadingCategory?.category ? '#1565C0' : '#29A9E1',
              }))}
            />
          }
        >
          <KpiValue
            value={leadingCategory?.category ?? '—'}
            caption={leadingCategory ? `${formatNumber(leadingCategory.totalStock)} unidades en stock` : 'Sin datos'}
          />
        </ExpandableCard>
        <ExpandableCard
            title="Distribución por categoría"
            subtitle="Cantidad de productos por categoría"
            expanded={expandedId === 'categoryChart'}
            onToggle={() => toggleCard('categoryChart')}
            sx={getCardGridSx('categoryChart', expandedId)}
            >
            <CategoryDonutChart
                categories={metrics.categories}
                height={expandedId === 'categoryChart' ? 300 : 180}
                legendPosition={expandedId === 'categoryChart' ? 'right' : 'bottom'}
            />
        </ExpandableCard>
        <ExpandableCard
            title="Top 5 productos más caros"
            subtitle="Precio unitario en pesos colombianos"
            expanded={expandedId === 'topPrices'}
            onToggle={() => toggleCard('topPrices')}
            sx={getCardGridSx('topPrices', expandedId)}
            >
            <TopPricesBarChart
                products={topExpensive}
                height={expandedId === 'topPrices' ? 360 : 240}
                compact={expandedId !== null && expandedId !== 'topPrices'}
            />
        </ExpandableCard>
      </Box>
    </>
  );
};