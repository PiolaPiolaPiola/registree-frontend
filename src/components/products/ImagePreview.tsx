import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { IMAGE_URL_REGEX } from '../../schemas/patterns';
import placeholderImage from '../../assets/producto-sin-imagen.svg';

interface ImagePreviewProps {
  url: string;
  size?: 'large' | 'small'; //Small para vista previa miniatura
  /** En el detalle los textos describen el producto, no instrucciones para el formulario */
  readOnly?: boolean;
}

/**
 * Vista previa de la imagen del producto.
 * Si la URL no es válida o la imagen no carga, muestra la imagen por defecto.
 */
export const ImagePreview = ({ url, size = 'large', readOnly = false }: ImagePreviewProps) => {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const trimmedUrl = url.trim();
  const isValidUrl = IMAGE_URL_REGEX.test(trimmedUrl);
  const showImage = isValidUrl && failedUrl !== trimmedUrl;
  const isSmall = size === 'small';

  const formCaption = !trimmedUrl
    ? 'Sin imagen: se usará la imagen por defecto'
    : !isValidUrl
      ? 'La URL todavía no es válida'
      : failedUrl === trimmedUrl
        ? 'No se pudo cargar la imagen: se usará la imagen por defecto'
        : 'Imagen principal';
  const detailCaption = !trimmedUrl ? 'Producto sin imagen' : showImage ? 'Imagen principal' : 'No se pudo cargar la imagen';
  const caption = readOnly ? detailCaption : formCaption;

  return (
    <Box sx={{ flex: 'none' }}>
      <Box
        sx={{
          width: isSmall ? 56 : '100%',
          height: isSmall ? 56 : 'auto',
          aspectRatio: isSmall ? '1 / 1' : '4 / 3',
          borderRadius: 'var(--rg-radius-md)',
          border: 'var(--rg-border)',
          bgcolor: 'primary.light',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={showImage ? trimmedUrl : placeholderImage}
          alt={showImage ? 'Vista previa del producto' : ''}
          onError={() => setFailedUrl(trimmedUrl)}
          sx={{ width: '100%', height: '100%', objectFit: showImage ? 'cover' : 'contain', p: showImage ? 0 : isSmall ? 0.5 : 2 }}
        />
      </Box>
      {!isSmall && (
        <Typography variant="caption" role="status" sx={{ display: 'block', mt: 1, color: 'text.secondary', textAlign: 'center' }}>
          {caption}
        </Typography>
      )}
    </Box>
  );
};
