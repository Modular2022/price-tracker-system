import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./navbar/navbar.component";
import { PrimengModule } from "../primeng/primeng.module";
import { ProductCardComponent } from './product-card/product-card.component';
import { StoreButtonComponent } from './store-button/store-button.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';




@NgModule({
  declarations: [NavbarComponent, ProductCardComponent, StoreButtonComponent, ImageCarouselComponent],
  imports: [
    CommonModule,
    NgbModule,
    PrimengModule
  ],
  exports: [NavbarComponent, StoreButtonComponent, ImageCarouselComponent]
})
export class ComponentsModule { }
