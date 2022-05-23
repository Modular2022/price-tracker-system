import { Department } from "src/app/models/department.interface";


export interface GetAllDepartmentsResponse {
  status:  string;
  results: number;
  data:  { department: Department[] };
}

export interface GetDepartmentResponse {
  status:  string;
  results: number;
  data:  { department: Department };
}
