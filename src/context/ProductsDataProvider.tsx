import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as productsApi from '../api/products.api';
import { toApiError } from '../api/api-error';
import type { Product } from '../models/product.model';
import { ProductsDataContext, type ProductsDataContextValue, type ProductsDataStatus, } from './products-data-context';

interface ProductsDataProviderProps {
  children: ReactNode;
}

/**
 * Se guarda en caché los productos consultados.
 * Se pide una sola vez al entrar a la app y de ahí se alimentan todas las métricas y gráficos,
 */
export const ProductsDataProvider = ({ children }: ProductsDataProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<ProductsDataStatus>('loading');
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Si llega una nueva recarga antes de que termine esta, la respuesta vieja se ignora
    let cancelled = false;

    productsApi
      .getAllProducts()
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        setStatus('success');
        setError(null);
        setLastUpdated(new Date());
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(toApiError(err).message);
        //Si ya había datos se conservan
        setStatus((current) => (current === 'success' ? 'success' : 'error'));
      })
      .finally(() => {
        if (!cancelled) setIsRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setReloadKey((current) => current + 1);
  }, []);

  const value = useMemo<ProductsDataContextValue>(
    () => ({ products, status, isRefreshing, error, lastUpdated, refresh }),
    [products, status, isRefreshing, error, lastUpdated, refresh],
  );

  return <ProductsDataContext.Provider value={value}>{children}</ProductsDataContext.Provider>;
};