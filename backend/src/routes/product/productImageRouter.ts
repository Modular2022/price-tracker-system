import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import ProductImageController from '../../controllers/product/product-image.controller';
import FileController from '../../controllers/common/file.controller';

const authController = new AuthController();
const productImageController = new ProductImageController();
const fileController = new FileController();

const router = express.Router();

router.post(
  '/:id_product/image',
  authController.protect,
  authController.restrictTo('admin'),
  fileController.uploadImage,
  fileController.resizeImage,
  productImageController.createProductImage
);

router.get('/:id_product/image', productImageController.getAllProductImages);

router.get('/image/:id_image', productImageController.getOneProductImage);

router.delete(
  '/image/:id',
  authController.protect,
  authController.restrictTo('admin'),
  productImageController.deleteProductImage
);

export default router;
