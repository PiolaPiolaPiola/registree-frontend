export interface PaginationParams {
  offset: number;
  limit: number;
}

export interface PaginatedResult<T> extends PaginationParams {
  data: T[];
  total: number;
}