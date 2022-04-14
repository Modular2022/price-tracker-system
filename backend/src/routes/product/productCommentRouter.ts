const express = require('express');
const authController = require('../controllers/authController');
const productCommentController = require('../controllers/productCommentController');

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

module.exports = router;
