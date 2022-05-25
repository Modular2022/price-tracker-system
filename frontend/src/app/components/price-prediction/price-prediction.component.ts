import { Component, Input, OnInit } from '@angular/core';
import { FetchedProduct } from "src/app/helper/responses/product.response";
import { PricePredictService } from "../../services/price-predict.service";
import { Prediction } from "../../helper/responses/prediction.response";

@Component({
  selector: 'app-price-prediction',
  templateUrl: './price-prediction.component.html',
  styleUrls: ['./price-prediction.component.css']
})
export class PricePredictionComponent implements OnInit {

  @Input() product!: FetchedProduct;
  prediction: Prediction | undefined;
  loading: boolean = false;

  get showPredictButton() {
    return (!this.loading && !this.prediction);
  }

  get showPredictionResults() {
    return (!this.loading && this.prediction);
  }

  constructor(
    private predictionService: PricePredictService
  ) { }

  ngOnInit(): void {
  }

  predict() {
    this.loading = true;
    const { id_product: id, name } = this.product;
    this.predictionService.getPrediction(id, name)
      .subscribe({
        next: (resp) => {
          // console.log( resp );
          this.prediction = resp;
        },
        error: (err) => {
          console.warn(err)
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

}
