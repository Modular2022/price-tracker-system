import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { GetAllProductsResponse, GetProductResponse } from "../helper/responses/product.response";
import { map } from "rxjs/operators";


@Injectable({
	providedIn: "root",
})
export class ProductsService {

	private baseUrl: string = environment.apiServices
  get URL() { return `${this.baseUrl}/product` }

  constructor(
    private http: HttpClient
  ) {}

  getProduct(id: number) {
    return this.http.get<GetProductResponse>( `${ this.URL }/${ id }` )
      .pipe( map( resp => resp.data.product ) );
  }

  getAllProducts( limit = 10, offset = 0 ) {
    const params = new HttpParams();
    params.append( "limit", limit );
    params.append( "offset", offset );
    return this.http.get<GetAllProductsResponse>( this.URL, { params } );
  }

}
