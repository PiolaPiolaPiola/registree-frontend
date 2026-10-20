import { http } from './http-client';
import type { PaginatedResult } from '../models/pagination.model';
import type { CreateProductDTO, DeleteProductResponse, Product, ProductFilters, UpdateProductDTO } from '../models/product.model';

const MAX_PAGE_SIZE = 100;

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

/**.
 * Hace 1 petición pasa saber el total count de registros y con esta data pide el todal
 * para retornarlos todos.
 */
export const getAllProducts = async (): Promise<Product[]> => {
  const firstPage = await getProducts({ offset: 0, limit: MAX_PAGE_SIZE });
  const totalPages = Math.ceil(firstPage.total / MAX_PAGE_SIZE);
  if (totalPages <= 1) return firstPage.data;

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getProducts({ offset: (index + 1) * MAX_PAGE_SIZE, limit: MAX_PAGE_SIZE }),
    ),
  );
  return [...firstPage.data, ...remainingPages.flatMap((page) => page.data)];
};