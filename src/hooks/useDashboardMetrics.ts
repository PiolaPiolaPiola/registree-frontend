import { useMemo } from 'react';
import type { DashboardMetrics } from '../models/metrics.model';
import { getCategorySummaries, getInventoryValue, getLeadingCategory, getRecentProducts, getStockSummary, getTopExpensiveProducts, } from '../services/metrics.service';
import { useProductsData } from './useProductsData';

/**
 * Métricas del dashboard calculadas a partir de la caché de productos.
 * useMemo para solo recalcular si cambian los productos
 */
export const useDashboardMetrics = () => {
  const { products, status, isRefreshing, error, lastUpdated, refresh } = useProductsData();

  const metrics = useMemo<DashboardMetrics>(() => {
    const categories = getCategorySummaries(products);
    return {
      totalProducts: products.length,
      inventoryValue: getInventoryValue(products),
      categories,
      leadingCategory: getLeadingCategory(categories),
      stock: getStockSummary(products),
    };
  }, [products]);

  const topExpensive = useMemo(() => getTopExpensiveProducts(products), [products]);
  const recentProducts = useMemo(() => getRecentProducts(products), [products]);

  return { metrics, topExpensive, recentProducts, status, isRefreshing, error, lastUpdated, refresh };
};