import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from "../components/components.module";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { PrimengModule } from "../primeng/primeng.module";
import { RouterModule } from "@angular/router";
import { ScreensComponent } from "./screens.component";
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { IndexComponent } from "./index/index.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";



@NgModule({
  declarations: [
    IndexComponent,
    ScreensComponent,
    ProductComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule,
    PrimengModule,
    InfiniteScrollModule
  ],
})
export class ScreensModule { }
