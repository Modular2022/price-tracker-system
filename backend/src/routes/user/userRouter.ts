import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import UserController from '../../controllers/user/user.controller';

const authController = new AuthController();
const userController = new UserController();

const router = express.Router();

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getAllUsers
);

router.get(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.getOneUser
);

router.post(
  '/wishlist/:id_product',
  authController.protect,
  userController.addProductToWishlist
);

router.get(
  '/wishlist/:id_product',
  authController.protect,
  userController.getWishListOfUser
);

router.delete(
  '/wishlist/:id_product',
  authController.protect,
  userController.removeProductFromWishlist
);

router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.banUser
);

export default router;
