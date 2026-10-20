import { createContext } from 'react';
import type { Product } from '../models/product.model';

/**
 * - loading: primera carga, todavía no hay datos
 * - success: hay datos 
 * - error: la primera carga falló y no hay datos
 */
export type ProductsDataStatus = 'loading' | 'success' | 'error';

export interface ProductsDataContextValue {
  products: Product[];
  status: ProductsDataStatus;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export const ProductsDataContext = createContext<ProductsDataContextValue | null>(null);