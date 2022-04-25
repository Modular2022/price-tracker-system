import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import ProductPriceController from '../../controllers/product/product-price.controller';

const authController = new AuthController();
const productPriceController = new ProductPriceController();

const router = express.Router();

router.post(
  '/:id_product/price',
  authController.protect,
  authController.restrictTo('admin'),
  productPriceController.createProductPrice
);

router.get(
  '/:id_product/price',
  productPriceController.getAllProductPrices
);

router.get(
  '/price/:id_price',
  productPriceController.getOneProductPrice
);

router.delete(
  '/price/:id_price',
  authController.protect,
  authController.restrictTo('admin'),
  productPriceController.deleteProductPrice
);

router.patch(
  '/price/:id_price',
  authController.protect,
  authController.restrictTo('admin'),
  productPriceController.updateProductPrice
);

export default router;
