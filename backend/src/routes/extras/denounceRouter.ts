import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import DenounceController from '../../controllers/extras/denounce.controller';

const authController = new AuthController();
const denounceController = new DenounceController();

const router = express.Router();

router.post('/', authController.protect, denounceController.createDenounce);

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  denounceController.getAllDenounces
);

router.get(
  '/:id_denounce',
  authController.protect,
  authController.restrictTo('admin'),
  denounceController.getOneDenounce
);

router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  denounceController.deleteDenounce
);

export default router;
