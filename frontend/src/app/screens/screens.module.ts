import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../components/components.module";
import { ScreensComponent } from "./screens.component";
import { RouterModule } from "@angular/router";
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { PrimengModule } from "../primeng/primeng.module";



@NgModule({
  declarations: [
    ScreensComponent,
    ProductComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule,
    PrimengModule
  ]
})
export class ScreensModule { }
