import { Button, Card } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusView } from '../components/feedback/StatusView';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { DataTable } from '../components/table/DataTable';
import { ProductFiltersBar } from '../components/products/ProductFiltersBar';
import { INVENTORY_PRODUCT_COLUMNS } from '../components/products/product-columns';
import type { RowAction } from '../components/table/table.types';
import type { Product } from '../models/product.model';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useProductDelete } from '../hooks/useProductDelete';
import { useProductsData } from '../hooks/useProductsData';
import { formatNumber } from '../utils/format';
import inventoryEmptyImage from '../assets/inventario-vacio.svg';
import noResultsImage from '../assets/sin-resultados.svg';

export const InventoryView = () => {
  const { isAdmin } = useAuth();
  const { refresh: refreshDashboard } = useProductsData();
  const inventory = useInventory();
  const { rows, total, pagination, filters } = inventory;

  /** Después de eliminar, si era el último de la página, se vuelve a la anterior; también se actualiza el dashboard */
  const handleDeleted = () => {
    if (rows.length === 1 && pagination.page > 0) {
      pagination.setPage(pagination.page - 1);
    } else {
      inventory.reload();
    }
    refreshDashboard();
  };

  const { productToDelete, deleting, requestDelete, cancelDelete, confirmDelete } = useProductDelete(handleDeleted);

  /** Solo ADMIN ve la columna de acciones; un USER solo consulta */
  const getRowActions = (product: Product): RowAction[] => [
    { label: `Eliminar ${product.title}`, icon: <DeleteOutlined fontSize="small" />, onClick: () => requestDelete(product), color: 'error' },
  ];

  const emptyState = inventory.hasFilters ? (
    <StatusView
      size="compact"
      image={noResultsImage}
      title="Sin resultados"
      description="Ningún producto coincide con la búsqueda o el rango de fechas."
      action={<Button variant="outlined" onClick={inventory.clearFilters}>Limpiar filtros</Button>}
    />
  ) : (
    <StatusView
      size="compact"
      image={inventoryEmptyImage}
      title="Aún no hay productos"
      description="Cuando se registren productos, aparecerán en esta tabla."
    />
  );

  return (
    <>
      <PageHeader
        title="Inventario"
        subtitle={inventory.loading ? 'Cargando productos…' : `${formatNumber(total)} productos activos`}
      />

      <Card>
        <ProductFiltersBar
          search={filters.search}
          fromDate={filters.fromDate}
          toDate={filters.toDate}
          hasFilters={inventory.hasFilters}
          onSearchChange={inventory.setSearch}
          onFromDateChange={inventory.setFromDate}
          onToDateChange={inventory.setToDate}
          onClear={inventory.clearFilters}
        />

        {inventory.error && rows.length === 0 ? (
          <StatusView
            size="compact"
            image={noResultsImage}
            title="No pudimos cargar el inventario"
            description={inventory.error}
            action={<Button variant="contained" onClick={inventory.reload}>Reintentar</Button>}
          />
        ) : (
          <DataTable
            ariaLabel="Inventario de productos"
            columns={INVENTORY_PRODUCT_COLUMNS}
            rows={rows}
            getRowId={(product) => product._id}
            getRowActions={isAdmin ? getRowActions : undefined}
            loading={inventory.loading}
            refreshing={inventory.refreshing}
            emptyState={emptyState}
            minWidth={760}
            pagination={{
              page: pagination.page,
              rowsPerPage: pagination.rowsPerPage,
              total,
              onPageChange: pagination.setPage,
              onRowsPerPageChange: pagination.setRowsPerPage,
            }}
          />
        )}
      </Card>

      <ConfirmDialog
        open={productToDelete !== null}
        tone="danger"
        title="¿Eliminar producto?"
        description={
          <>
            <strong>{productToDelete?.title}</strong> dejará de aparecer en el inventario y en las métricas del dashboard.
          </>
        }
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};