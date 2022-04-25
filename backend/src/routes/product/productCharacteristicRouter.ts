import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import ProductCharacteristicController from '../../controllers/product/product-characteristic.controller';

const authController = new AuthController();
const productCharacteristicController = new ProductCharacteristicController();

const router = express.Router();


router.post(
  '/:id_product/characteristic',
  authController.protect,
  authController.restrictTo('admin'),
  productCharacteristicController.createProductCharacteristic
);

router.get(
  '/:id_product/characteristic',
  productCharacteristicController.getAllProductCharacteristics
);

router.get(
  '/characteristic/:id_characteristic',
  productCharacteristicController.getOneProductCharacteristic
);

router.delete(
  '/characteristic/:id_characteristic',
  authController.protect,
  authController.restrictTo('admin'),
  productCharacteristicController.deleteProductCharacteristic
);

router.patch(
  '/characteristic/:id_characteristic',
  authController.protect,
  authController.restrictTo('admin'),
  productCharacteristicController.updateProductCharacteristic
);

export default router;
