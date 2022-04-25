import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IndexComponent } from "./index/index.component";
import { SearchComponent } from "./search/search.component";
import { ProductComponent } from "./product/product.component";


const childRoutes: Routes = [
  { path: "home", component: IndexComponent },
  { path: "product/:id", component: ProductComponent },
  { path: "search", component: SearchComponent },
  { path: "**", redirectTo: "home", pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forChild( childRoutes )],
	exports: [RouterModule],
})
export class ChildRoutesModule {}
