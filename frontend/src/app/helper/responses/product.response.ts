import { Department } from "src/app/models/department.interface";
import { Product } from "src/app/models/product.interface";
import { Store } from "src/app/models/store.interface";


export interface GetProductResponse {
  status: string;
  data: { product: Product & { 
    images: { image: string, id_product_image: number }[],
    store: Store,
    department: Department,
    characteristics: { id_characteritic: number, property_name: string, property_value: string },
    prices: { price: number, created_at: Date }[]
  } }
}

export interface GetAllProductsResponse {
  status: string;
  results: number;
  data: { products: Product[] }
}