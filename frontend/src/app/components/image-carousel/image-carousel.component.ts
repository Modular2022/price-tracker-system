import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css']
})
export class ImageCarouselComponent implements OnInit {
  @Input() images: { image: string, id_product_image: number }[] = [];

  get areThereAnyImages() {
    return this.images.length > 0;
  }

  get unavailablePlacerholderImage() {
    return "https://faculty.eng.ufl.edu/machine-learning/wp-content/uploads/sites/58/2015/11/img-placeholder.png";
  }

  constructor() { }

  ngOnInit(): void {
  }

}
