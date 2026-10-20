import { Chip, Typography } from '@mui/material';
import type { DataTableColumn } from '../table/table.types';
import type { Product } from '../../models/product.model';
import { formatCurrency, formatDate } from '../../utils/format';

/** Columnas de producto*/
const titleColumn: DataTableColumn<Product> = {
  id: 'title',
  header: 'Título',
  render: (product) => (
    <Typography sx={{ fontWeight: 700, maxWidth: 280 }} noWrap title={product.title}>
      {product.title}
    </Typography>
  ),
};

const categoryColumn: DataTableColumn<Product> = {
  id: 'category',
  header: 'Categoría',
  render: (product) => (
    <Chip label={product.category} size="small" sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 700 }} />
  ),
};

const priceColumn: DataTableColumn<Product> = {
  id: 'price',
  header: 'Precio',
  align: 'right',
  render: (product) => <Typography sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCurrency(product.price)}</Typography>,
};

const creationAtColumn: DataTableColumn<Product> = {
  id: 'creationAt',
  header: 'Fecha de creación',
  render: (product) => (
    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
      {formatDate(product.creationAt)}
    </Typography>
  ),
};

export const RECENT_PRODUCT_COLUMNS = [titleColumn, categoryColumn, priceColumn, creationAtColumn];