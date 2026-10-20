import { useState } from 'react';

export const usePagination = (initialRowsPerPage = 10) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPageState] = useState(initialRowsPerPage);

  /** Al cambiar las filas por página se vuelve a la primera, para no quedar en una página que ya no existe */
  const setRowsPerPage = (value: number) => {
    setRowsPerPageState(value);
    setPage(0);
  };

  /** Cuando se cambia un filtro los resultados son otros y se empieza desde la primera página */
  const resetPage = () => setPage(0);

  return { page, rowsPerPage, offset: page * rowsPerPage, limit: rowsPerPage, setPage, setRowsPerPage, resetPage };
};