import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";
import { Store } from "../models/store.interface";
import { map } from "rxjs/operators";
import { GetAllStoresResponse, GetStoreResponse } from "../helper/responses/store.responses";
import { Observable } from "rxjs";


@Injectable({
	providedIn: "root",
})
export class StoresService {
  
  private baseUrl: string = environment.apiServices;
  get URL() { return `${this.baseUrl}/store` }

	constructor(
    private http: HttpClient
  ) {}

  getAllStores(): Observable<Store[]> {
    return this.http.get<GetAllStoresResponse>(this.URL)
      .pipe( map( (resp) => resp.data.stores ) ); 
  }

  getStore(id: number) {
    return this.http.get<GetStoreResponse>( `${this.URL}/${id}` )
      .pipe( map( resp => {
        const store = resp.data.stores;
        return store;
      } ) );
  }

}
