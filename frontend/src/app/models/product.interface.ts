
export interface Product {
  id_product: number;
  store_id: number;
  sku: string;
  upc: string;
  name: string;
  brand: string;
  summary: string;
  department_id: number;
  description: string;
  url: string;
  followers?: number;
}