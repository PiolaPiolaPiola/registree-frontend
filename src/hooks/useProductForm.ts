import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProduct, getProductById, updateProduct } from '../api/products.api';
import { toApiError } from '../api/api-error';
import type { CreateProductDTO, Product } from '../models/product.model';
import { parsePrice, productFormSchema, type ProductFormValues } from '../schemas/product.schema';
import { useToast } from './useToast';

const EMPTY_VALUES: ProductFormValues = { title: '', description: '', category: '', price: '', stock: '', imageUrl: '' };

/** Unifica los espacios dobles*/
const normalizeText = (value: string): string => value.trim().replace(/\s+/g, ' ');

const toFormValues = (product: Product): ProductFormValues => ({
  title: product.title,
  description: product.description,
  category: product.category,
  price: String(product.price).replace('.', ','),
  stock: String(product.stock),
  imageUrl: product.images[0] ?? '',
});

/**La imagen del formulario es la principal.*/
const toProductDTO = (values: ProductFormValues, original: Product | null): CreateProductDTO => {
  const otherImages = original?.images.slice(1) ?? [];
  return {
    title: normalizeText(values.title),
    description: normalizeText(values.description),
    category: normalizeText(values.category),
    price: parsePrice(values.price),
    stock: Number(values.stock),
    images: values.imageUrl ? [values.imageUrl, ...otherImages] : otherImages,
  };
};

type LoadState = { status: 'loading' } | { status: 'ready'; product: Product | null } | { status: 'error'; message: string };

export const useProductForm = (productId: string | null, onSaved: (product: Product) => void) => {
  const { showSuccess } = useToast();
  const isEdit = productId !== null;
  const [loadState, setLoadState] = useState<LoadState>(isEdit ? { status: 'loading' } : { status: 'ready', product: null });
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);

  const { control, handleSubmit, reset, formState } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange',
    defaultValues: EMPTY_VALUES,
  });

  const imageUrl = useWatch({ control, name: 'imageUrl' });

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    getProductById(productId)
      .then((product) => {
        if (cancelled) return;
        reset(toFormValues(product));
        setLoadState({ status: 'ready', product });
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadState({ status: 'error', message: toApiError(err).message });
      });

    return () => {
      cancelled = true;
    };
  }, [productId, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (loadState.status !== 'ready') return;
    setSubmitErrors([]);
    try {
      const dto = toProductDTO(values, loadState.product);
      const saved = loadState.product ? await updateProduct(loadState.product._id, dto) : await createProduct(dto);
      showSuccess(isEdit ? `"${saved.title}" se actualizó` : `"${saved.title}" se creó en el inventario`);
      onSaved(saved);
    } catch (err) {
      const apiError = toApiError(err);
      //Si la API no devuelve lista de errores, se muestra el de por defecto
      setSubmitErrors(apiError.errors.length > 0 ? apiError.errors : [apiError.message]);
    }
  });

  return {
    control,
    onSubmit,
    isEdit,
    isSubmitting: formState.isSubmitting,
    loadState,
    submitErrors,
    imageUrl,
  };
};