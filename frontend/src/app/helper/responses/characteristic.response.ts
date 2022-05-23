import { Characteristic } from "../../models/characteristic.interface";


export interface GetCharacteristicResponse {
  status: string;
  data: {
    product_characteristic: Characteristic;
  }
}

export interface GetAllCharacteristicsResponse {
  status: string;
  data: {
    product_characteristics: Characteristic[]
  }
}