import type { ReactNode } from 'react';
import { Box, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { LoadingState } from '../feedback/LoadingState';
import { DataTablePagination } from './DataTablePagination';
import { RowActions } from './RowActions';
import type { DataTableColumn, RowAction, TablePaginationConfig } from './table.types';

const ROW_HEIGHT = 60;

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  ariaLabel: string;
  /** Si se envía, se agrega al final la columna "Acciones" con los botones de cada fila */
  getRowActions?: (row: T) => RowAction[];
  /** Deshabilita las acciones de todas las filas mientras una acción está en curso, para evitar dobles clics o acciones sobre datos viejos */
  actionsDisabled?: boolean;
  /** Si se envía, se muestra la paginación debajo de la tabla */
  pagination?: TablePaginationConfig;
  loading?: boolean;
  refreshing?: boolean;
  /** Contenido cuando no hay filas. Imagen por defecto */
  emptyState?: ReactNode;
  minRows?: number;
  minWidth?: number;
}

/**
 * Tabla genérica del proyecto, reutilizable
 * Recibe columnas, acciones y paginación como props: la vista decide qué mostrar
 */
export const DataTable = <T,>({
  columns,
  rows,
  getRowId,
  ariaLabel,
  getRowActions,
  actionsDisabled = false,
  pagination,
  loading = false,
  refreshing = false,
  emptyState,
  minRows = 5,
  minWidth = 640,
}: DataTableProps<T>) => {
  const columnCount = columns.length + (getRowActions ? 1 : 0);
  const fillerRows = Math.max(0, minRows - rows.length);
  const reservedHeight = minRows * ROW_HEIGHT;

  /** Celda única que ocupa todo el ancho: se usa para el spinner y el estado vacío */
  const renderFullWidthRow = (content: ReactNode) => (
    <TableRow>
      <TableCell colSpan={columnCount} sx={{ height: reservedHeight, borderBottom: 'none' }}>
        {content}
      </TableCell>
    </TableRow>
  );

  const renderBody = () => {
    if (loading) {
      return renderFullWidthRow(<LoadingState minHeight={reservedHeight - 32} />);
    }

    if (rows.length === 0) {
      return renderFullWidthRow(
        emptyState ?? (
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            No hay registros para mostrar.
          </Typography>
        ),
      );
    }

    return (
      <>
        {rows.map((row) => (
          <TableRow key={getRowId(row)} hover>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align}>
                {column.render(row)}
              </TableCell>
            ))}
            {getRowActions && (
              <TableCell align="right">
                <RowActions actions={getRowActions(row)} disabled={actionsDisabled} />
              </TableCell>
            )}
          </TableRow>
        ))}
        {Array.from({ length: fillerRows }, (_, index) => (
          <TableRow key={`filler-${index}`} aria-hidden>
            <TableCell colSpan={columnCount} />
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {refreshing && !loading && (
        <LinearProgress color="secondary" aria-label="Actualizando" sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />
      )}
      <TableContainer>
        <Table aria-label={ariaLabel} sx={{ minWidth, '& .MuiTableBody-root .MuiTableRow-root': { height: ROW_HEIGHT } }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={{ width: column.width }}>
                  {column.header}
                </TableCell>
              ))}
              {getRowActions && <TableCell align="right">Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>{renderBody()}</TableBody>
        </Table>
      </TableContainer>
      {pagination && rows.length > 0 && <DataTablePagination {...pagination} />}
    </Box>
  );
};