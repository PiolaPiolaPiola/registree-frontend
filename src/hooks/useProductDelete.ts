import { useState } from 'react';
import { deleteProduct } from '../api/products.api';
import { toApiError } from '../api/api-error';
import type { Product } from '../models/product.model';
import { useToast } from './useToast';

export const useProductDelete = (onDeleted: (product: Product) => void) => {
  const { showSuccess, showError } = useToast();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const requestDelete = (product: Product) => setProductToDelete(product);

  const cancelDelete = () => setProductToDelete(null);

  const confirmDelete = async () => { //Pide confirmación al usuario para eliminar
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete._id);
      showSuccess(`"${productToDelete.title}" se eliminó del inventario`);
      onDeleted(productToDelete);
      setProductToDelete(null);
    } catch (err) {
      showError(toApiError(err).message);
    } finally {
      setDeleting(false);
    }
  };

  return { productToDelete, deleting, requestDelete, cancelDelete, confirmDelete };
};