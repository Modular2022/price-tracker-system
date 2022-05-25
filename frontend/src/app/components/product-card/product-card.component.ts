import { Component, Input, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { ProductPreview as Product } from "../../helper/responses/product.response";


@Component({
	selector: "app-product-card",
	templateUrl: "./product-card.component.html",
	styleUrls: ["./product-card.component.css"],
})
export class ProductCardComponent {

  @Input() product!: Product;

  get image() {
    return this.product.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png";
  }

  get link() {
    return `/product/${ this.product.id_product }`;
  }

  get price() {
    return this.product.price.price;
  }

  get discount() {
    return this.product.discount * -1;
  }

  get store() {
    return this.product.store.name.toUpperCase();
  }
  
  isWhatPercentOf( a: number, b: number ): number {
    return ((a/b) * 100);
  }

}
