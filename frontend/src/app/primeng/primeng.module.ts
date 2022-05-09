// default angular imports
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// PrimeNG imports
import { ButtonModule } from "primeng/button";
import { TabMenuModule } from "primeng/tabmenu";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SplitterModule } from "primeng/splitter";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { CarouselModule } from "primeng/carousel";

@NgModule({
	declarations: [],
	imports: [
		CommonModule,

		ButtonModule,
		TabMenuModule,
		ProgressSpinnerModule,
		SplitterModule,
		BreadcrumbModule,
    CarouselModule,
	],
	exports: [
		ButtonModule,
		TabMenuModule,
		ProgressSpinnerModule,
		SplitterModule,
		BreadcrumbModule,
    CarouselModule,
	],
})
export class PrimengModule {}
