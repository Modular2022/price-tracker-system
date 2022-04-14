const express = require('express');
const authController = require('../controllers/authController');
const productImageController = require('../controllers/productImageController');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post(
  '/:id_product/image',
  authController.protect,
  authController.restrictTo('admin'),
  fileController.uploadImage,
  fileController.resizeImage,
  productImageController.adjustParamsToBody,
  productImageController.createProductImage
);

router.get('/:id_product/image', productImageController.getAllProductImages);

router.get('/image/:id_image', productImageController.getOneProductImage);

router.delete(
  '/image/:id_image',
  authController.protect,
  authController.restrictTo('admin'),
  productImageController.adjustParamsToBody,
  productImageController.deleteProductImage
);

module.exports = router;
