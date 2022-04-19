import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import ProductRequestController from '../../controllers/extras/product-request.controller';

const authController = new AuthController();
const productRequestController = new ProductRequestController();

const router = express.Router();

router.post(
  '/',
  authController.protect,
  productRequestController.createProductRequest
);

router.get(
  '/',
  authController.protect,
  productRequestController.getAllProductRequests
);

router.get(
  '/:id_product_request',
  authController.protect,
  productRequestController.getOneProductRequest
);

router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  productRequestController.deleteProductRequest
);

export default router;
