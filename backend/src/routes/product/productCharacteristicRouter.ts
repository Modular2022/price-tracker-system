const express = require('express');
const authController = require('../controllers/authController');
const productCharacteristicController = require('../controllers/productCharacteristicController');

const router = express.Router();

router.post(
  '/:id_product/characteristic',
  authController.protect,
  authController.restrictTo('admin'),
  productCharacteristicController.adjustParamsToBody,
  productCharacteristicController.createProductCharacteristic
);

router.get(
  '/:id_product/characteristic',
  productCharacteristicController.adjustParamsToBody,
  productCharacteristicController.getAllProductCharacteristics
);

router.get(
  '/characteristic/:id_characteristic',
  productCharacteristicController.adjustParamsToBody,
  productCharacteristicController.getOneProductCharacteristic
);

router.delete(
  '/characteristic/:id_characteristic',
  authController.protect,
  authController.restrictTo('admin'),
  productCharacteristicController.adjustParamsToBody,
  productCharacteristicController.deleteProductCharacteristic
);

router.patch(
  '/characteristic/:id_characteristic',
  authController.protect,
  authController.restrictTo('admin'),
  productCharacteristicController.adjustParamsToBody,
  productCharacteristicController.updateProductCharacteristic
);

module.exports = router;
