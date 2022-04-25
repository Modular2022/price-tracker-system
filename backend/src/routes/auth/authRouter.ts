import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';

const router = express.Router();

const authController = new AuthController();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.protect, authController.logout);
router.patch('/reset-password/:token', authController.resetPassword);
router.post('/forgot-password', authController.forgotPassword);
router.post(
  '/verify-token',
  authController.protect,
  authController.verifyToken
);
router.post('/update-token', authController.updateToken);
router.patch(
  '/update-password',
  authController.protect,
  authController.updatePassword
);

export default router;
