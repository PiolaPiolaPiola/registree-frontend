export interface CategorySummary {
  category: string;
  productCount: number;
  totalStock: number;
}

export interface StockSummary {
  available: number;
  lowStock: number;
  outOfStock: number;
}

export interface DashboardMetrics {
  totalProducts: number;
  inventoryValue: number;
  categories: CategorySummary[];
  leadingCategory: CategorySummary | null;
  stock: StockSummary;
}