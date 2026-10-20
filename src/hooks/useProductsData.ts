import { useContext } from 'react';
import { ProductsDataContext, type ProductsDataContextValue } from '../context/products-data-context';

export const useProductsData = (): ProductsDataContextValue => {
  const context = useContext(ProductsDataContext);
  if (!context) {
    throw new Error('useProductsData debe usarse dentro de ProductsDataProvider');
  }
  return context;
};