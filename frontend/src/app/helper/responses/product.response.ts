import { Department } from "src/app/models/department.interface";
import { Product } from "src/app/models/product.interface";
import { Store } from "src/app/models/store.interface";

export type FetchedProduct = Product & { 
  department: Department,
  store: Store,
  prices: { price: number, created_at: string }[],
  characteristics?: { id_characteritic: number, property_name: string, property_value: string }[],
  images?: { image: string, id_product_image: number }[],
}

export type ProductPreview = {
  id_product: number;
  name:       string;
  followers:  number;
  url:        string;
  average:    number;
  image:      string | null;
  discount:   number;
  price:      { price: number, date: string };
  score:      number;
  votes:      number;
  department: Department;
  store:      Store;
}

export interface GetProductResponse {
  status: string;
  data: { product: FetchedProduct }
}

export interface GetAllProductsResponse {
  status: string;
  results: number;
  data: { products: ProductPreview[] }
}