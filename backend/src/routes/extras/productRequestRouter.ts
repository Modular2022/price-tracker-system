const express = require('express');
const authController = require('../controllers/authController');
const productRequestController = require('../controllers/addProductRequestController');

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

module.exports = router;
