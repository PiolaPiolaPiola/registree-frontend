import { useCallback, useEffect, useMemo, useState } from 'react';
import { getUsers } from '../api/users.api';
import { toApiError } from '../api/api-error';
import type { User, UserFilters } from '../models/user.model';
import { usePagination } from './usePagination';

type UsersResult =
  | { requestKey: string; ok: true; rows: User[]; total: number }
  | { requestKey: string; ok: false; message: string };

export const useUsers = () => {
  const pagination = usePagination();
  const [active, setActiveState] = useState(true);
  const [lastSuccess, setLastSuccess] = useState<Extract<UsersResult, { ok: true }> | null>(null);
  const [lastResult, setLastResult] = useState<UsersResult | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const { offset, limit, resetPage } = pagination;
  const filters = useMemo<UserFilters>(() => ({ offset, limit, active }), [offset, limit, active]);
  const requestKey = `${JSON.stringify(filters)}#${reloadKey}`;

  useEffect(() => {
    let cancelled = false;

    getUsers(filters)
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

  /** Si se cambia de estado se vuelve a la primera página */
  const setActive = (value: boolean) => {
    setActiveState(value);
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
    active,
    setActive,
    reload,
  };
};