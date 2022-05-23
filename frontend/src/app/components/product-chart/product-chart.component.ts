import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets } from "chart.js";
import { Color, Label, MultiDataSet, SingleDataSet } from "ng2-charts";
import { hexToRGB } from "src/app/helper/functions/utils";
import { Price } from "src/app/models/price.interface";
import { Store } from "src/app/models/store.interface";
import { ProductPricesService } from "src/app/services/product-prices.service";

@Component({
  selector: 'app-product-chart',
  templateUrl: './product-chart.component.html',
  styleUrls: ['./product-chart.component.css']
})
export class ProductChartComponent implements OnInit {

  @Input("id") productId!: number;
  @Input() store!: Store;

  prices: Price[] = [];
  title: string = "Histórico de precios"

  chartLabels!: Label[];
  chartData!: ChartDataSets[];

  get sortedPrices() {
    return this.prices.sort( (a, b) => {
      if (a.date > b.date) return 1;
      if (a.date < b.date) return -1;
      return 0
    } );
  }

  get onlyPrices() {
    return this.sortedPrices.map( elm => elm.price );
  }

  get datesToLabels() {
    return this.sortedPrices.map( elm => new Date(elm.date).toLocaleDateString() );
  }

  get color() {
    return `#${ this.store.color }`;
  }

   constructor(
    private pricesSrvc: ProductPricesService
  ) { }

  ngOnInit(): void {
    this.pricesSrvc.getAllPrices(this.productId).subscribe({
      next: (resp) => {
        this.prices = resp;
        this.chartData = [{
          data: this.onlyPrices,
          label: this.title,
          backgroundColor: hexToRGB( this.color, 0.2 ),
          borderColor: hexToRGB( this.color, 1 ),
          pointBackgroundColor: hexToRGB( this.color, 1 ),
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: hexToRGB( this.color, 0.8 ),
          fill: 'origin',
        }];
        this.chartLabels = this.datesToLabels;
      },
      error: (err) => console.warn(err),
      // complete: () => {},
    });
  }

}
