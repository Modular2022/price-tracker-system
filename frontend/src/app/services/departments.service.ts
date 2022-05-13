import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { GetAllDepartmentsResponse, GetDepartmentResponse } from "../helper/responses/department.response";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Department } from "../models/department.interface";


@Injectable({
	providedIn: "root",
})
export class DepartmentsService {

  private baseUrl: string = environment.apiServices;
  get URL() { return `${this.baseUrl}/department` }

	constructor(
    private http: HttpClient
  ) {}

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<GetAllDepartmentsResponse>( this.URL )
      .pipe( map( resp => {
        const departments = resp.data.department;
        return departments;
      } ) );
  }

  getDepartment(id: number) {
    return this.http.get<GetDepartmentResponse>( `${ this.URL }/${ id }` )
      .pipe( map( resp => resp.data.department ) );
  }

}
