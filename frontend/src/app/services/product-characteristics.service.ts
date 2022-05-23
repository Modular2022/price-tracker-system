import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { GetAllCharacteristicsResponse, GetCharacteristicResponse } from "../helper/responses/characteristic.response";


@Injectable({
	providedIn: "root",
})
export class ProductCharacteristicsService {

	private baseUrl: string = environment.apiServices;
  get URL() { return `${ this.baseUrl }/product`; }

	constructor(
    private http: HttpClient
  ) {}

  getCharacteristic(id: number) {
    const url = `${ this.URL }/characteristic/${ id }`;
    return this.http.get<GetCharacteristicResponse>(url)
      .pipe( map( resp => resp.data.product_characteristic ) );
  }

  getAllCharacteristics(id: number) {
    const url = `${ this.URL }/${ id }/characteristic`;
    return this.http.get<GetAllCharacteristicsResponse>(url)
      .pipe( map( resp => resp.data.product_characteristics ) );
  }

}
