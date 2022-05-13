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
import { GalleriaModule } from "primeng/galleria";

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
    GalleriaModule,
	],
	exports: [
		ButtonModule,
		TabMenuModule,
		ProgressSpinnerModule,
		SplitterModule,
		BreadcrumbModule,
    CarouselModule,
    GalleriaModule,
	],
})
export class PrimengModule {}
