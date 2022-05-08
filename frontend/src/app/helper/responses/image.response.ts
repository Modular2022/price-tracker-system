
type ImageFetched = {
  id_product_image: number;
  image: string;
}

export interface GetImageResponse {
  status: string;
  data: { product_image: ImageFetched }
}

export interface GetAllImagesResponse {
  status: string;
  data: { product_images: ImageFetched[] }
}
