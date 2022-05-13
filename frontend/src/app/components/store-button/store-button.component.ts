import { Component, Input, OnInit } from "@angular/core";
import { Store } from "src/app/models/store.interface";

@Component({
	selector: "app-store-button",
	templateUrl: "./store-button.component.html",
	styleUrls: ["./store-button.component.css"],
})
export class StoreButtonComponent implements OnInit {
  @Input() store!: Store;
  @Input() url: string = "";

  get storeName() { return this.store.name.toUpperCase(); }

  get storeColor() { return `#${ this.store.color }`; }

	constructor() {}

	ngOnInit(): void {}
}
