const express = require('express');
const authController = require('../controllers/authController');
const productHistoryPriceController = require('../controllers/productHistoryPriceController');
// const fileController = require('../controllers/fileController');

const router = express.Router();

router.post(
  '/:id_product/history',
  authController.protect,
  authController.restrictTo('admin'),
  productHistoryPriceController.adjustParamsToBody,
  productHistoryPriceController.createProductHistoryPrice
);

router.get(
  '/:id_product/history',
  productHistoryPriceController.getAllProductHistoryPrices
);

router.get(
  '/history/:id_history',
  productHistoryPriceController.adjustParamsToBody,
  productHistoryPriceController.getOneProductHistoryPrice
);

router.delete(
  '/history/:id_history',
  authController.protect,
  authController.restrictTo('admin'),
  productHistoryPriceController.adjustParamsToBody,
  productHistoryPriceController.deleteProductHistoryPrice
);

router.patch(
  '/history/:id_history',
  authController.protect,
  authController.restrictTo('admin'),
  productHistoryPriceController.adjustParamsToBody,
  productHistoryPriceController.updateProductHistoryPrice
);

module.exports = router;
