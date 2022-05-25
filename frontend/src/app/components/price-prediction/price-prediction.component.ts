import { Component, Input, OnInit } from '@angular/core';
import { FetchedProduct } from "src/app/helper/responses/product.response";
import { PricePredictService } from "../../services/price-predict.service";
import { Prediction } from "../../helper/responses/prediction.response";
import { MessageService } from "primeng/api";

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

  get percentage() {
    // if (this.prediction!.percentage < 0)
    //   this.prediction!.percentage = this.prediction!.percentage * -1;

    return (this.prediction!.percentage*100).toFixed(2);
  }

  get valueOfPercentage() {
    const actual = this.product.prices[ this.product.prices.length-1 ].price;
    const percent = this.prediction!.percentage;
    const amount = (percent*actual)/100;
    return amount+actual;
  }

  constructor(
    private predictionService: PricePredictService,
    private messageService: MessageService
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

          const { percentage } = this.prediction;

          if (percentage < 0) this.prediction.percentage = percentage*-1;
        },
        error: (err) => {
          console.warn(err);
          if (err.status === 0) 
          this.messageService.add({
            severity: "error",
            summary: "Error desconocido",
            detail: "Falla inesperada del servidor. Intente de nuevo más tarde."
          });
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

}
