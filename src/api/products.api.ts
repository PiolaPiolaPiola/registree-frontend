import { http } from './http-client';
import type { PaginatedResult } from '../models/pagination.model';
import type { CreateProductDTO, DeleteProductResponse, Product, ProductFilters, UpdateProductDTO } from '../models/product.model';

/** GET /products: listado paginado con búsqueda y rango de fechas */
export const getProducts = async (filters: ProductFilters = {}): Promise<PaginatedResult<Product>> => {
  const { data } = await http.get<PaginatedResult<Product>>('/products', { params: filters });
  return data;
};

/** GET /products/:id: detalle de un producto */
export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await http.get<Product>(`/products/${id}`);
  return data;
};

/** POST /products: crea un producto*/
export const createProduct = async (dto: CreateProductDTO): Promise<Product> => {
  const { data } = await http.post<Product>('/products', dto);
  return data;
};

/** PATCH /products/:id: actualiza solo los campos enviados*/
export const updateProduct = async (id: string, dto: UpdateProductDTO): Promise<Product> => {
  const { data } = await http.patch<Product>(`/products/${id}`, dto);
  return data;
};

/** DELETE /products/:id: inactiva los productos*/
export const deleteProduct = async (id: string): Promise<DeleteProductResponse> => {
  const { data } = await http.delete<DeleteProductResponse>(`/products/${id}`);
  return data;
};