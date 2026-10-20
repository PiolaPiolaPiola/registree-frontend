import { TablePagination } from '@mui/material';
import type { TablePaginationConfig } from './table.types';

/** Opciones de filas por página.*/
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

const PAGE_BUTTON_LABELS = {
  first: 'Primera página',
  last: 'Última página',
  next: 'Página siguiente',
  previous: 'Página anterior',
} as const;

export const DataTablePagination = ({ page, rowsPerPage, total, onPageChange, onRowsPerPageChange }: TablePaginationConfig) => (
  <TablePagination
    component="div"
    count={total}
    page={page}
    rowsPerPage={rowsPerPage}
    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
    onPageChange={(_, newPage) => onPageChange(newPage)}
    onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
    labelRowsPerPage="Filas por página"
    labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
    getItemAriaLabel={(type) => PAGE_BUTTON_LABELS[type]}
    sx={{ borderTop: 'var(--rg-border)' }}
  />
);