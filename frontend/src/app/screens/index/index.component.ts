import { Component, OnInit } from "@angular/core";
import { ProductsService } from "src/app/services/products.service";
import { ProductPreview } from "../../helper/responses/product.response";

type InfinteScrollEvent = {
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

  limit: number = 1;
  offset: number = 0;

	constructor(
    private productsSrvc: ProductsService,
  ) {}

	ngOnInit(): void {
    this.productsSrvc.getAllProducts(this.limit, this.offset).subscribe({
      next: (resp) => this.prdcts = resp,
      error: (err) => console.warn(err),
      complete: () => this.loading = false,
    });
  }

  onScrollDown(event: InfinteScrollEvent) {
    // console.log("scroll down", event);

    // fetch more products
    this.productsSrvc.getAllProducts(this.limit, this.offset+this.limit)
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
