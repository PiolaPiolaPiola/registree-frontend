import { Alert, Box, InputAdornment, Stack } from '@mui/material';
import { FormDialog } from '../feedback/FormDialog';
import { LoadingState } from '../feedback/LoadingState';
import { FormTextField } from '../form/FormTextField';
import { FormAutocompleteField } from '../form/FormAutocompleteField';
import { ImagePreview } from './ImagePreview';
import { useProductForm } from '../../hooks/useProductForm';
import { PRODUCT_LIMITS, type ProductFormValues } from '../../schemas/product.schema';
import type { Product } from '../../models/product.model';

interface ProductFormDialogProps {
  /** null para crear, el id para editar */
  productId: string | null;
  categories: string[];
  onClose: () => void;
  onSaved: (product: Product) => void;
}

/** Modal de crear y editar producto*/
export const ProductFormDialog = ({ productId, categories, onClose, onSaved }: ProductFormDialogProps) => {
  const { control, onSubmit, isEdit, isSubmitting, loadState, submitErrors, imageUrl } = useProductForm(productId, onSaved);

  const renderContent = () => {
    if (loadState.status === 'loading') return <LoadingState message="Cargando producto…" minHeight={320} />;
    if (loadState.status === 'error') return <Alert severity="error">{loadState.message}</Alert>;

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 220px' }, gap: 3, pt: 1 }}>
        <Stack spacing={2.5}>
          {submitErrors.length > 0 && (
            <Alert severity="error">
              {submitErrors.map((message) => (
                <div key={message}>{message}</div>
              ))}
            </Alert>
          )}
          <FormTextField<ProductFormValues> name="title" control={control} label="Título" autoFocus slotProps={{ htmlInput: { maxLength: PRODUCT_LIMITS.titleMax } }} />
          <FormTextField<ProductFormValues>
            name="description"
            control={control}
            label="Descripción"
            multiline
            minRows={3}
            slotProps={{ htmlInput: { maxLength: PRODUCT_LIMITS.descriptionMax } }}
          />
          <FormAutocompleteField<ProductFormValues>
            name="category"
            control={control}
            label="Categoría"
            options={categories}
            helperText="Elige una existente o escribe una nueva"
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormTextField<ProductFormValues>
              name="price"
              control={control}
              label="Precio"
              slotProps={{
                htmlInput: { inputMode: 'decimal' },
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
              }}
            />
            <FormTextField<ProductFormValues> name="stock" control={control} label="Stock" slotProps={{ htmlInput: { inputMode: 'numeric' } }} />
          </Stack>
          <FormTextField<ProductFormValues>
            name="imageUrl"
            control={control}
            label="URL de la imagen (opcional)"
            placeholder="https://…"
            slotProps={{ htmlInput: { inputMode: 'url' } }}
          />
        </Stack>
        <ImagePreview url={imageUrl} />
      </Box>
    );
  };

  return (
    <FormDialog
      open
      title={isEdit ? 'Editar producto' : 'Nuevo producto'}
      subtitle={isEdit ? 'Los cambios se verán en el inventario y en el dashboard' : 'Completa los datos del producto'}
      submitLabel={isEdit ? 'Guardar cambios' : 'Crear producto'}
      submitting={isSubmitting}
      submitDisabled={loadState.status !== 'ready'}
      onClose={onClose}
      onSubmit={onSubmit}
      maxWidth="md"
    >
      {renderContent()}
    </FormDialog>
  );
};