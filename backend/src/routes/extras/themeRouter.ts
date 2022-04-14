const express = require('express');
const authController = require('../controllers/authController');
const fileController = require('../controllers/fileController');
const themeController = require('../controllers/themeController');

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

module.exports = router;
