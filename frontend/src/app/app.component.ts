import { Component, OnInit } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {

	title = "price-tracker-ui";

  constructor(private primeConfig: PrimeNGConfig) {}

  ngOnInit(): void { this.primeConfig.ripple = true; }

}
