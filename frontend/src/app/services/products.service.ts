import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { GetAllProductsResponse as FetchProductsResponse, GetProductResponse } from "../helper/responses/product.response";
import { delay, map } from "rxjs/operators";


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
      .pipe(
        delay(1000),
        map( resp => resp.data.product )
      );
  }

  getAllProducts( limit = 10, offset = 0 ) {
    const params = new HttpParams()
                    .append( "limit", limit )
                    .append( "offset", offset );
    return this.http.get<FetchProductsResponse>( this.URL, { params } )
      .pipe(
        delay(1000),
        map( resp => resp.data.products )
      );
  }

  searchProducts(name: string, { limit, offset }: { limit: number, offset: number }) {
    const url = `${ this.URL }/search/${ name }`;
    const params = new HttpParams()
                    .append( "limit", limit )
                    .append( "offset", offset );
    return this.http.get<FetchProductsResponse>(url, { params })
      .pipe(
        delay(2000),
        map( resp => resp.data.products )
      );
  }

}
