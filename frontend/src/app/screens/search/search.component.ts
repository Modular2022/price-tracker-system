import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ProductPreview } from "src/app/helper/responses/product.response";
import { SearchControl, Search } from "../../forms/controls/search";
import { ProductsService } from "../../services/products.service";
import { InfinteScrollEvent } from "../index/index.component";


@Component({
	selector: "app-search",
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit {

  loading: boolean = false;
  results: ProductPreview[] = [];
  params = {
    limit: 50,
    offset: 0,
  }

  searchControl: SearchControl = new SearchControl();
  get keyword() {
    return <FormControl>this.searchControl.formGroup.get("keyword");
  }

  get inputEmpty() {
    const { keyword } = this.searchControl.toPayload();
    return keyword === "";
  }

	constructor(
    private productsSrvc: ProductsService,
    private messageService: MessageService
  ) {}

	ngOnInit(): void {
    this.registerValueChanges();
  }

  private registerValueChanges() {
    this.keyword.valueChanges.subscribe( (value: string) => {

    } );
  }

  onSearch() {
    // show spinner
    this.loading = true;
    // clear results
    this.results = [];

    const { keyword } = this.searchControl.toPayload();
    this.productsSrvc.searchProducts(keyword, this.params).subscribe({
      next: (resp) => this.results = resp,
      error: (err) => console.warn(err),
      complete: () => this.loading = false,
    });
  }

  onScrollDown(event: InfinteScrollEvent) {
    // show spinner
    this.loading = true;
    const { keyword } = this.searchControl.toPayload();
    this.productsSrvc.searchProducts(keyword, {
      limit: this.params.limit,
      offset: this.params.offset + this.params.limit
    }).subscribe({
      next: (resp) => this.results = [ ...this.results, ...resp ],
      error: (err) => console.warn(err),
      complete: () => this.loading = false,
    });
  }

}
