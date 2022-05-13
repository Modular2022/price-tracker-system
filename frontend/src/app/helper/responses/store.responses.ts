import { Store } from "src/app/models/store.interface";


export interface GetAllStoresResponse {
  status:  string;
  results: number;
  data:    { stores: Store[] };
}


export interface GetStoreResponse {
  status: string;
  data:   { stores: Store };
}