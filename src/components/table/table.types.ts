import type { ReactNode } from 'react';

/** Definición de una columna: cada vista decide qué mostrar y cómo */
export interface DataTableColumn<T> {
  id: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
}

/** Acción de una fila" */
export interface RowAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  color?: 'primary' | 'error' | 'success' | 'inherit';
  disabled?: boolean;
}

/** Estado de la paginación que recibe la tabla. La página empieza en 0*/
export interface TablePaginationConfig {
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}