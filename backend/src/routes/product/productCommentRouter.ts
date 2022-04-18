import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import ProductCommentController from '../../controllers/product/product-comment.controller';

const authController = new AuthController();
const productCommentController = new ProductCommentController();

const router = express.Router();

router.post(
  '/:id_product/comment',
  authController.protect,
  authController.restrictTo('admin', 'user', 'moderator'),
  productCommentController.createProductComment
);

router.post(
  '/:id_product/comment/:id_comment',
  authController.protect,
  authController.restrictTo('admin', 'user', 'moderator'),
  productCommentController.createProductCommentResponse
);

router.patch(
  '/comment/:id_comment',
  authController.protect,
  authController.restrictTo('admin', 'user', 'moderator'),
  productCommentController.updateProductComment
);

router.get(
  '/:id_product/comment',
  productCommentController.getAllProductComments
);

router.get(
  '/:id_product/comment/:id_comment',
  productCommentController.getAllProductCommentsResponse
);

router.delete(
  '/comment/:id_comment',
  authController.protect,
  authController.restrictTo('admin', 'user', 'moderator'),
  productCommentController.deleteProductComment
);

export default router;
