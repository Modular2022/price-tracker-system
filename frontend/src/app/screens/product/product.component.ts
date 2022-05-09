import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FetchedProduct } from "src/app/helper/responses/product.response";
import { ProductsService } from "src/app/services/products.service";
import { environment } from "src/environments/environment";


export type BreadcrumbItem = {
  label: string;
  route?: string;
}
@Component({
	selector: "app-product",
	templateUrl: "./product.component.html",
	styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit {
	loading: boolean = true;
  breadcrumbs: BreadcrumbItem[] = [
    { label: "Inicio", route: "/home" },
  ];

	productId!: number;
	product: FetchedProduct | undefined;

  get latestPrice() {
    const prices = this.product?.prices || [];
    if (prices.length > 1) return (prices.sort()[ prices.length - 1 ]).price;
    else if (prices.length === 1) return (prices[0]).price;

    return null;
  }

  get characteristics() {
    return this.product?.characteristics || [];
  }

  get areThereAnyCharacteristics() {
    return (this.product!.characteristics!.length > 0)
  }

	constructor(
		private currentRoute: ActivatedRoute,
		private productsSrvc: ProductsService
	) {}

	ngOnInit(): void {
		this.currentRoute.params.subscribe(
			({ id }) => (this.productId = parseInt(id))
		);
		this.fetchProduct();
	}

	fetchProduct() {
		this.productsSrvc.getProduct(this.productId!).subscribe({
			next: (product) => {
        this.product = product;
        this.breadcrumbs = [
          ...this.breadcrumbs,
          { label: this.product.department.name, route: `/departments/${ this.product.department_id }` },
          { label: this.product.name, },
        ];
        console.log( this.latestPrice )
      },
			error: (err) => console.warn(err),
			complete: () => (this.loading = false),
		});
	}
}
