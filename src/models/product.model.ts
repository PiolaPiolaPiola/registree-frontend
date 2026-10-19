import type { PaginationParams } from './pagination.model';

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  active: boolean;
  createdBy?: string;
  updatedBy?: string;
  creationAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
}

export type UpdateProductDTO = Partial<CreateProductDTO> & {
  active?: boolean;
};

/** Las fechas van como texto YYYY-MM-DD, asi las espera el backend.*/
export interface ProductFilters extends Partial<PaginationParams> {
  search?: string;
  from?: string;
  to?: string;
}