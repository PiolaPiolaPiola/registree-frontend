import { useMemo, useState } from 'react';
import { Button, Card } from '@mui/material';
import { AddRounded, DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusView } from '../components/feedback/StatusView';
import { ConfirmDialog } from '../components/feedback/ConfirmDialog';
import { DataTable } from '../components/table/DataTable';
import { ProductFiltersBar } from '../components/products/ProductFiltersBar';
import { ProductFormDialog } from '../components/products/ProductFormDialog';
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
  const { products: cachedProducts, refresh: refreshDashboard } = useProductsData();
  const inventory = useInventory();
  const { rows, total, pagination, filters } = inventory;
  /** null: modal cerrado. productId null: crear; con id: editar */
  const [formTarget, setFormTarget] = useState<{ productId: string | null } | null>(null);

  /** Categorías existentes (sin repetir) para sugerirlas en el formulario */
  const categories = useMemo(
    () => [...new Set(cachedProducts.map((product) => product.category))].sort((a, b) => a.localeCompare(b, 'es')),
    [cachedProducts],
  );

  /** Después de crear o editar: se cierra el modal y se actualizan el listado y el dashboard */
  const handleSaved = () => {
    setFormTarget(null);
    inventory.reload();
    refreshDashboard();
  };

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
    { label: `Editar ${product.title}`, icon: <EditOutlined fontSize="small" />, onClick: () => setFormTarget({ productId: product._id }) },
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
        actions={
          isAdmin && (
            <Button variant="contained" startIcon={<AddRounded />} onClick={() => setFormTarget({ productId: null })}>
              Nuevo producto
            </Button>
          )
        }
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

      {formTarget && (
        <ProductFormDialog
          productId={formTarget.productId}
          categories={categories}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
        />
      )}

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