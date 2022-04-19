import express from 'express';

import AuthController from '../../controllers/auth/auth.controller';
import FileController from '../../controllers/common/file.controller';
import StoreController from '../../controllers/store/store.controller';

const authController = new AuthController();
const fileController = new FileController();
const storeController = new StoreController();
const router = express.Router();

router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  fileController.uploadImage,
  fileController.resizeImage,
  storeController.createStore
);

router.get('/', storeController.getAllStores);

router.get('/:id_store', storeController.getOneStore);

router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  storeController.deleteStore
);

router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  fileController.uploadImage,
  fileController.resizeImage,
  storeController.updateStore
);

export default router;
