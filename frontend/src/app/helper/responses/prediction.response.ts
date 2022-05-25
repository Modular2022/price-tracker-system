export interface GetPricePredictionResponse {
  status: string;
  data:   {
    prediction: Prediction;
  };
}
export interface Prediction {
  goesUp:     boolean;
  value:      number;
  percentage: number;
  name:       string[];
}
