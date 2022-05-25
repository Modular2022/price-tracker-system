import express from 'express';

import ProductPriceRouter from './productPriceRouter';
import ProductImageRouter from './productImageRouter';
import ProductCharacteristicRouter from './productCharacteristicRouter';
import ProductReviewRouter from './productReviewRouter';
import ProductCommentRouter from './productCommentRouter';

import AuthController from '../../controllers/auth/auth.controller';
import ProductController from '../../controllers/product/product.controller';

const authController = new AuthController();
const productController = new ProductController();

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

router.get('/:id/predict', productController.getPredictionProduct);

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

router.use('/', ProductPriceRouter);
router.use('/', ProductImageRouter);
router.use('/', ProductCharacteristicRouter);
router.use('/', ProductReviewRouter);
router.use('/', ProductCommentRouter);

export default router;
