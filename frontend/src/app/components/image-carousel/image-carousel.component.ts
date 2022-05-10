import { Component, Input, OnInit } from '@angular/core';


type CarouselItem = {

}
@Component({
	selector: "app-image-carousel",
	templateUrl: "./image-carousel.component.html",
	styleUrls: ["./image-carousel.component.css"],
})
export class ImageCarouselComponent implements OnInit {

	@Input() images: { image: string; id_product_image: number }[] = [];

  get areThereAnyImages(): boolean {
    return this.images.length > 0;
  }

  get unavailableImage(): string {
    return "https://pdabullying.com/img/unavailable/placeholder-unavailable-image.png";
  }

	constructor() {}

	ngOnInit(): void {}

}
