import Decimal from 'decimal.js';
import type { Product } from '../models/product.model';
import type { CategorySummary, StockSummary } from '../models/metrics.model';
import { LOW_STOCK_THRESHOLD } from '../utils/stock';

/** Valor total inventario: suma de precio × stock de cada producto */
export const getInventoryValue = (products: Product[]): number => 
  products
    .reduce((total, product) => total
    .plus(new Decimal(product.price).times(product.stock)), new Decimal(0))
    .toNumber();

/** Agrupa los productos por categoría (cantidad de productos y stock total), ordenados de mayor a menor cantidad*/
export const getCategorySummaries = (products: Product[]): CategorySummary[] => {
  const byCategory = products.reduce<Record<string, CategorySummary>>((groups, product) => {
    const group = groups[product.category] ?? { category: product.category, productCount: 0, totalStock: 0 };
    groups[product.category] = {
      ...group,
      productCount: group.productCount + 1,
      totalStock: group.totalStock + product.stock,
    };
    return groups;
  }, {});

  return Object.values(byCategory).sort((a, b) => b.productCount - a.productCount);
};

/** Categoría con mayor stock total. null si no hay categorías */
export const getLeadingCategory = (summaries: CategorySummary[]): CategorySummary | null => {
  if (summaries.length === 0) return null;
  return summaries.reduce((leader, current) => (current.totalStock > leader.totalStock ? current : leader));
};

/**Se ordena por precio y se toman los 5 primeros*/
export const getTopExpensiveProducts = (products: Product[], count = 5): Product[] =>
  [...products].sort((a, b) => b.price - a.price).slice(0, count);

/** La caché ya viene ordenada por fecha de creación descendente desde el backend, solo se toman los primeros*/
export const getRecentProducts = (products: Product[], count = 5): Product[] => products.slice(0, count);

/** Cuántos productos están disponibles, con poco stock o agotados*/
export const getStockSummary = (products: Product[]): StockSummary => ({
  available: products.filter((product) => product.stock > LOW_STOCK_THRESHOLD).length,
  lowStock: products.filter((product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD).length,
  outOfStock: products.filter((product) => product.stock === 0).length,
});
