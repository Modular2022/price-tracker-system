import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ButtonModule } from "primeng/button";
import { TabMenuModule } from "primeng/tabmenu";


@NgModule({
	declarations: [],
	imports: [CommonModule, ButtonModule, TabMenuModule ],
	exports: [ButtonModule, TabMenuModule ],
})
export class PrimengModule {}
