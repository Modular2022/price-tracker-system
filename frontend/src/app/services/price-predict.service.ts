import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { GetPricePredictionResponse } from "../helper/responses/prediction.response";
import { map, delay } from "rxjs/operators";


@Injectable({
	providedIn: "root",
})
export class PricePredictService {

  private baseUrl: string = environment.apiServices;

  get URL() {
    return `${ this.baseUrl }/product`;
  }

	constructor(
    private http: HttpClient
  ) {}

  getPrediction( id: number, name: string ) {
    const url = `${ this.URL }/${ id }/predict`; 
    const params = new HttpParams().append( "name", name );
    return this.http.get<GetPricePredictionResponse>( url, { params } )
      .pipe(
        delay(3000),
        map( resp => resp.data.prediction )
      );
  }

}
