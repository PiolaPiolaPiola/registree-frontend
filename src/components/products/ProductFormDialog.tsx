import { Alert, Box, Button, IconButton, InputAdornment, Stack, Tooltip, Typography } from '@mui/material';
import { AddPhotoAlternateOutlined, DeleteOutlined, InfoOutlined, OpenInNewRounded } from '@mui/icons-material';
import { FormDialog } from '../feedback/FormDialog';
import { LoadingState } from '../feedback/LoadingState';
import { FormTextField } from '../form/FormTextField';
import { FormAutocompleteField } from '../form/FormAutocompleteField';
import { ImagePreview } from './ImagePreview';
import { useProductForm } from '../../hooks/useProductForm';
import { PRODUCT_LIMITS, type ProductFormValues } from '../../schemas/product.schema';
import { IMAGE_URL_REGEX } from '../../schemas/patterns';
import type { Product } from '../../models/product.model';

interface ProductFormDialogProps {
  /** null para crear, el id para editar */
  productId: string | null;
  categories: string[];
  onClose: () => void;
  onSaved: (product: Product) => void;
  /** Ver detalle tendra los mismos campos pero no editables*/
  readOnly?: boolean;
}

/** Modal de crear, editar y ver detalle de un producto*/
export const ProductFormDialog = ({ productId, categories, onClose, onSaved, readOnly = false }: ProductFormDialogProps) => {
  const { control, onSubmit, isEdit, isSubmitting, loadState, submitErrors, imageFields, imageUrls, addImage, removeImage, canAddImage } =
    useProductForm(productId, onSaved);

  const renderContent = () => {
    if (loadState.status === 'loading') return <LoadingState message="Cargando producto…" minHeight={320} />;
    if (loadState.status === 'error') return <Alert severity="error">{loadState.message}</Alert>;

    // En el detalle solo se muestran las imágenes que tienen URL
    const visibleImages = imageFields
      .map((field, index) => ({ field, index }))
      .filter(({ index }) => !readOnly || (imageUrls[index] ?? '').trim() !== '');

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
          <FormTextField<ProductFormValues> name="title" control={control} label="Título" autoFocus={!readOnly} disabled={readOnly} required={!readOnly} slotProps={{ htmlInput: { maxLength: PRODUCT_LIMITS.titleMax } }} />
          <FormTextField<ProductFormValues>
            name="description"
            control={control}
            label="Descripción"
            disabled={readOnly}
            required={!readOnly}
            multiline
            minRows={3}
            slotProps={{ htmlInput: { maxLength: PRODUCT_LIMITS.descriptionMax } }}
          />
          <FormAutocompleteField<ProductFormValues>
            name="category"
            control={control}
            label="Categoría"
            options={categories}
            disabled={readOnly}
            required={!readOnly}
            helperText={readOnly ? undefined : 'Elige una existente o escribe una nueva'}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormTextField<ProductFormValues>
              name="price"
              control={control}
              label="Precio"
              disabled={readOnly}
              required={!readOnly}
              slotProps={{
                htmlInput: { inputMode: 'decimal' },
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
              }}
            />
            <FormTextField<ProductFormValues> name="stock" control={control} label="Stock" disabled={readOnly} required={!readOnly} slotProps={{ htmlInput: { inputMode: 'numeric' } }} />
          </Stack>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Typography variant="subtitle1" component="h3">
                {readOnly ? 'Imágenes' : `Imágenes (opcional, máximo ${PRODUCT_LIMITS.imagesMax})`}
              </Typography>
              {readOnly && visibleImages.length > 0 && (
                <Tooltip title="Abre cada imagen en una pestaña nueva para verla en tamaño completo o guardarla en tu equipo">
                  <InfoOutlined sx={{ fontSize: 18, color: 'text.secondary' }} aria-label="Cómo ver o guardar las imágenes" />
                </Tooltip>
              )}
            </Stack>
            {readOnly && visibleImages.length === 0 && <Typography variant="body2">Este producto no tiene imágenes.</Typography>}
            {visibleImages.map(({ field, index }) => (
              <Stack key={field.id} direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                <ImagePreview url={imageUrls[index] ?? ''} size="small" />
                <FormTextField<ProductFormValues>
                  name={`images.${index}.url`}
                  control={control}
                  label={index === 0 ? 'URL de la imagen principal' : `URL de la imagen ${index + 1}`}
                  placeholder="https://…"
                  disabled={readOnly}
                  slotProps={{ htmlInput: { inputMode: 'url' } }}
                />
                {readOnly ? (
                  <Tooltip title="Abrir imagen en una pestaña nueva">
                    <span>
                      <IconButton
                        component="a"
                        href={imageUrls[index]}
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={!IMAGE_URL_REGEX.test((imageUrls[index] ?? '').trim())}
                        aria-label={`Abrir imagen ${index + 1} en una pestaña nueva`}
                        sx={{ mt: 1, color: 'primary.main' }}
                      >
                        <OpenInNewRounded fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title="Quitar imagen">
                    <IconButton onClick={() => removeImage(index)} aria-label={`Quitar imagen ${index + 1}`} sx={{ mt: 1 }}>
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            ))}
            {!readOnly && (
              <Button
                variant="outlined"
                startIcon={<AddPhotoAlternateOutlined />}
                onClick={addImage}
                disabled={!canAddImage}
                sx={{ alignSelf: 'flex-start' }}
              >
                {canAddImage ? 'Agregar imagen' : `Máximo ${PRODUCT_LIMITS.imagesMax} imágenes`}
              </Button>
            )}
          </Stack>
        </Stack>
        <Box sx={{ position: { md: 'sticky' }, top: 0, alignSelf: 'start' }}>
          <ImagePreview url={imageUrls[0] ?? ''} readOnly={readOnly} />
        </Box>
      </Box>
    );
  };

  return (
    <FormDialog
      open
      title={readOnly ? 'Detalle del producto' : isEdit ? 'Editar producto' : 'Nuevo producto'}
      subtitle={
        readOnly ? 'Solo lectura' : isEdit ? 'Los cambios se verán en el inventario y en el dashboard' : 'Completa los datos del producto'
      }
      submitLabel={isEdit ? 'Guardar cambios' : 'Crear producto'}
      submitting={isSubmitting}
      submitDisabled={loadState.status !== 'ready'}
      readOnly={readOnly}
      onClose={onClose}
      onSubmit={onSubmit}
      maxWidth="md"
    >
      {renderContent()}
    </FormDialog>
  );
};