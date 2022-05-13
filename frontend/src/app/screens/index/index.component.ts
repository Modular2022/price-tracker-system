import { Component, OnInit } from '@angular/core';
import { DepartmentsService } from "../../services/departments.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private departmentsSrvc: DepartmentsService
  ) { }

  ngOnInit(): void {

  }

}
