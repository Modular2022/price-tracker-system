const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const productHistoryPriceRouter = require('./productHistoryPriceRouter.js');
const productImageRouter = require('./productImageRouter.js');
const productCharacteristicRouter = require('./productCharacteristicRouter.js');
const productReviewRouter = require('./productReviewRouter.js');
const productCommentRouter = require('./productCommentRouter.js');

const router = express.Router();

router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  productController.createProduct
);

router.post(
  '/scrap',
  authController.protect,
  authController.restrictTo('admin', 'scrapper'),
  productController.createProductScrapper
);

router.patch(
  '/scrap',
  authController.protect,
  authController.restrictTo('admin'),
  productController.updateProductScrapper
);

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getOneProduct);

router.get('/search/:name', productController.searchProduct);

router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  productController.deleteProduct
);

router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  productController.updateProduct
);

router.use('/', productHistoryPriceRouter);
router.use('/', productImageRouter);
router.use('/', productCharacteristicRouter);
router.use('/', productReviewRouter);
router.use('/', productCommentRouter);

module.exports = router;
