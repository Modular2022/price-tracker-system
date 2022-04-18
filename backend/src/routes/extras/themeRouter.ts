import express from 'express';

import AuthController from '../../controllers/auth/auth.controller';
import FileController from '../../controllers/common/file.controller';
import ThemeController from '../../controllers/extras/theme.controller';

const authController = new AuthController();
const fileController = new FileController();
const themeController = new ThemeController();
const router = express.Router();

router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  fileController.uploadImage,
  fileController.resizeImage,
  themeController.createTheme
);

router.get('/', themeController.getAllThemes);

router.get('/default', themeController.getDefaultTheme);

router.get('/:id_theme', themeController.getOneTheme);

router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  themeController.deleteTheme
);

router.patch(
  '/default',
  authController.protect,
  authController.restrictTo('admin'),
  themeController.setDefaultTheme
);

router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  fileController.uploadImage,
  fileController.resizeImage,
  themeController.updateTheme
);

export default router;
