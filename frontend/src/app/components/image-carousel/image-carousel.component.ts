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

	constructor() {}

	ngOnInit(): void {}

}
