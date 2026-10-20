import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dayjs } from 'dayjs';
import { getProducts } from '../api/products.api';
import { toApiError } from '../api/api-error';
import type { Product, ProductFilters } from '../models/product.model';
import { useDebouncedValue } from './useDebouncedValue';
import { usePagination } from './usePagination';

const API_DATE_FORMAT = 'YYYY-MM-DD';

type InventoryResult =
  | { requestKey: string; ok: true; rows: Product[]; total: number }
  | { requestKey: string; ok: false; message: string };

/** Listado del inventario con paginación y filtros*/
export const useInventory = () => {
  const pagination = usePagination();
  const [search, setSearchState] = useState('');
  const [fromDate, setFromDateState] = useState<Dayjs | null>(null);
  const [toDate, setToDateState] = useState<Dayjs | null>(null);
  const [lastSuccess, setLastSuccess] = useState<Extract<InventoryResult, { ok: true }> | null>(null);
  const [lastResult, setLastResult] = useState<InventoryResult | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebouncedValue(search.trim());
  const { offset, limit, resetPage } = pagination;
  const from = fromDate?.format(API_DATE_FORMAT);
  const to = toDate?.format(API_DATE_FORMAT);

  const filters = useMemo<ProductFilters>(
    () => ({ offset, limit, search: debouncedSearch || undefined, from, to }),
    [offset, limit, debouncedSearch, from, to],
  );
  const requestKey = `${JSON.stringify(filters)}#${reloadKey}`;

  useEffect(() => {
    // Si cambian los filtros antes de que llegue la respuesta, la respuesta vieja se ignora
    let cancelled = false;

    getProducts(filters)
      .then((result) => {
        if (cancelled) return;
        const success = { requestKey, ok: true as const, rows: result.data, total: result.total };
        setLastSuccess(success);
        setLastResult(success);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLastResult({ requestKey, ok: false, message: toApiError(err).message });
      });

    return () => {
      cancelled = true;
    };
  }, [filters, requestKey]);

  /** Cada cambio de filtro debe volver a la primera página */
  const setSearch = (value: string) => {
    setSearchState(value);
    resetPage();
  };

  const setFromDate = (value: Dayjs | null) => {
    setFromDateState(value);
    resetPage();
  };

  const setToDate = (value: Dayjs | null) => {
    setToDateState(value);
    resetPage();
  };

  const clearFilters = () => {
    setSearchState('');
    setFromDateState(null);
    setToDateState(null);
    resetPage();
  };

  const reload = useCallback(() => setReloadKey((current) => current + 1), []);

  const isCurrent = lastResult?.requestKey === requestKey;
  const error = isCurrent && !lastResult.ok ? lastResult.message : null;

  return {
    rows: lastSuccess?.rows ?? [],
    total: lastSuccess?.total ?? 0,
    loading: lastSuccess === null && !error,
    refreshing: lastSuccess !== null && !isCurrent,
    error,
    pagination,
    filters: { search, fromDate, toDate },
    hasFilters: Boolean(search.trim() || fromDate || toDate),
    setSearch,
    setFromDate,
    setToDate,
    clearFilters,
    reload,
  };
};