import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { PrimengModule } from "../primeng/primeng.module";
import { ChartsModule } from "ng2-charts";
import { NavbarComponent } from "./navbar/navbar.component";
import { ProductCardComponent } from "./product-card/product-card.component";
import { StoreButtonComponent } from "./store-button/store-button.component";
import { ImageCarouselComponent } from "./image-carousel/image-carousel.component";
import { ProductChartComponent } from "./product-chart/product-chart.component";

@NgModule({
	declarations: [
		NavbarComponent,
		ProductCardComponent,
		StoreButtonComponent,
		ImageCarouselComponent,
		ProductChartComponent,
	],
	imports: [CommonModule, ChartsModule, NgbModule, PrimengModule],
	exports: [
		NavbarComponent,
		ProductCardComponent,
		StoreButtonComponent,
		ImageCarouselComponent,
		ProductChartComponent,
	],
})
export class ComponentsModule {}
