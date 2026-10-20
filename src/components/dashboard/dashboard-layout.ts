import type { SxProps, Theme } from '@mui/material';

/** Tarjetas del dashboard que se pueden expandir */
export type DashboardCardId =
  | 'totalProducts'
  | 'inventoryValue'
  | 'leadingCategory'
  | 'categoryChart'
  | 'topPrices'
  | 'recentActivity';

/** Columnas que ocupa cada tarjeta cuando ninguna está expandida (la grilla tiene 3 porque es la más grande horizontalmente) */
const DEFAULT_COLUMNS: Record<DashboardCardId, number> = {
  totalProducts: 1,
  inventoryValue: 1,
  leadingCategory: 1,
  categoryChart: 1,
  topPrices: 2,
  recentActivity: 3,
};

/** Cambia dinámicamente la posición de la card según si está expandida o no., También cambia el tamaño de columnas, para el efecto*/
export const getCardGridSx = (id: DashboardCardId, expandedId: DashboardCardId | null): SxProps<Theme> => {
  if (expandedId === id) {
    return { gridColumn: { md: 'span 2' }, gridRow: { md: 'span 2' }, order: { md: -1 } };
  }
  return { gridColumn: { md: `span ${expandedId ? 1 : DEFAULT_COLUMNS[id]}` } };
};