import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./navbar/navbar.component";
import { PrimengModule } from "../primeng/primeng/primeng.module";
import { ProductCardComponent } from './product-card/product-card.component';



@NgModule({
  declarations: [NavbarComponent, ProductCardComponent],
  imports: [
    CommonModule,
    PrimengModule
  ],
  exports: [NavbarComponent]
})
export class ComponentsModule { }
