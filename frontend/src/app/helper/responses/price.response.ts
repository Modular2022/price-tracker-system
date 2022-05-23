import { Price } from "src/app/models/price.interface";

export interface GetPriceResponse {
  status: string;
  data: {
    product_prices: Price;
  }
}

export interface GetAllPricesResponse {
  status: string;
  results: number;
  data: {
    product_prices: Price[];
  };
}