import { FormGroup, ValidationErrors } from '@angular/forms';

/**
 * A wrapper class for Reactive Forms that helps keeping track
 * of the type of the model being used in the form
 */
export default interface Control<T = any> {
  /**
   *The parent Control of the current Control
   */
  parent?: Control;
  /**
   * The children Controls of the current Control
   */
  children?: { [K in keyof T]?: Control<T[K]> };
  /**
   * The instance of the FormGroup that the Control manages
   */
  readonly formGroup: FormGroup;
  /**
   * Formats the current Control state into a JSON Payload
   */
  toPayload(): Object;
  /**
   * Loads a state to the Control with the given object
   * @param model The JSON with the values to be loaded
   */
  loadFromModel(model: T): void;
}


export function errorsToString(errors: ValidationErrors | null) {
  return Object.values(errors || {}).join("\n");
}

export function listErrors(errors?: Object) {
  if (errors) return Object.values(errors).join('\n');
  return '';
}
