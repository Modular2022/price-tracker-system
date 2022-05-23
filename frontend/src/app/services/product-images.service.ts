import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { GetAllImagesResponse, GetImageResponse } from "../helper/responses/image.response";
import { map } from "rxjs/operators";
import { Image } from "../models/image.interface";

@Injectable({
	providedIn: "root",
})
export class ProductImagesService {
  
  private baseUrl: string = environment.apiServices;
  get URL() { return `${ this.baseUrl }/product`; }

	constructor(
    private http: HttpClient
  ) {}

  getImage(id: number) {
    const url = `${ this.URL }/image/${ id }`;
    return this.http.get<GetImageResponse>(url)
      .pipe( map( resp => resp.data.product_image ) );
  }

  getAllImages(id: number) {
    const url = `${ this.URL }/${ id }/image`;
    return this.http.get<GetAllImagesResponse>(url)
      .pipe( map( resp => resp.data.product_images ) );
  }

}
