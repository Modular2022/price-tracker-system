import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { GetAllPricesResponse, GetPriceResponse } from "../helper/responses/price.response";
import { map } from "rxjs/operators";
import { pipe } from "rxjs";


@Injectable({
	providedIn: "root",
})
export class ProductPricesService {

  private baseUrl: string = environment.apiServices;
  get URL() { return `${ this.baseUrl }/product`; }

	constructor(
    private http: HttpClient
  ) {}

  getPrice(id: number) {
    const url = `${ this.URL }/price/${ id }`;
    return this.http.get<GetPriceResponse>( url )
      .pipe( map( resp => resp.data.product_prices ) );
  }

  getAllPrices(id: number) {
    const url = `${ this.URL }/${ id }/price`;
    return this.http.get<GetAllPricesResponse>(url)
      .pipe( map( resp => resp.data.product_prices ) );
  }

}
