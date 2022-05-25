import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { ProductsService } from "src/app/services/products.service";
import { ProductPreview } from "../../helper/responses/product.response";

export type InfinteScrollEvent = {
  currentScrollPosition: number
}
@Component({
	selector: "app-index",
	templateUrl: "./index.component.html",
	styleUrls: ["./index.component.css"],
})
export class IndexComponent implements OnInit {

  loading: boolean = true;
  prdcts: ProductPreview[] = [];

  limit: number = 12;
  offset: number = 0;

	constructor(
    private productsSrvc: ProductsService,
    private messageService: MessageService
  ) {}

	ngOnInit(): void {
    this.productsSrvc.getAllProducts(this.limit, this.offset).subscribe({
      next: (resp) => this.prdcts = resp,
      error: (err) => {
        // console.warn(err);
        if (err.status === 0) 
          this.messageService.add({
            severity: "error",
            summary: "Error desconocido",
            detail: "Falla inesperada del servidor. Intente de nuevo más tarde."
          });
      },
      complete: () => this.loading = false,
    });
  }

  onScrollDown(event: InfinteScrollEvent) {
    // console.log("scroll down", event);

    // fetch more products
    this.offset = this.offset+this.limit;
    this.productsSrvc.getAllProducts(this.limit, this.offset)
      .subscribe({
        next: (resp) => this.prdcts = [ ...this.prdcts, ...resp ],
        error: (err) => console.warn(err),
        // complete: () => {},
      });
  }

  onScrollUp(event: InfinteScrollEvent) {
    // console.log("scroll up", event);
  }


}
