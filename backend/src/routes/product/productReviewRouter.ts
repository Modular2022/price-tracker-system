import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import ProductReviewController from '../../controllers/product/product-review.controller';

const authController = new AuthController();
const productReviewController = new ProductReviewController();

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

export default router;
