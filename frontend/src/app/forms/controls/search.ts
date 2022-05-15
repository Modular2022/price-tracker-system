import { FormControl, FormGroup } from "@angular/forms";
import Control from "../Control";


export type Search = {
  keyword: string;
}

export class SearchControl implements Control<Search> {

  private _formGroup!: FormGroup;
  get formGroup(): FormGroup {
    return this._formGroup;
  };

  constructor(form?: Search) {
    this.initFormGroup(form);
  }

  private initFormGroup(form?: Search) {
    this._formGroup = new FormGroup({
      keyword: new FormControl(""),
    });

    if (form) this.loadFromModel(form);
  }

  loadFromModel(model: Search) {
    this.formGroup.patchValue(model);
  }

  toPayload(): Search {
    const { keyword } = this._formGroup.controls;
    return {
      keyword: keyword.value || ""
    }
  }

}