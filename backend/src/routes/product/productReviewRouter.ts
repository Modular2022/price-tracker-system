const express = require('express');
const authController = require('../controllers/authController');
const productReviewController = require('../controllers/productReviewController');
// const fileController = require('../controllers/fileController');

const router = express.Router();

router.post(
  '/:id_product/review',
  authController.protect,
  authController.restrictTo('admin', 'user', 'moderator'),
  productReviewController.createProductReview
);

router.patch(
  '/review/:id_review',
  authController.protect,
  authController.restrictTo('admin', 'user', 'moderator'),
  productReviewController.updateProductReview
);

router.get('/:id_product/review', productReviewController.getAllProductReviews);
router.get(
  '/:id_product/review/me',
  authController.protect,
  authController.restrictTo('admin', 'user', 'moderator'),
  productReviewController.getMyProductReview
);

router.delete(
  '/review/:id_review',
  authController.protect,
  authController.restrictTo('admin', 'user', 'moderator'),
  productReviewController.deleteProductReview
);

module.exports = router;
