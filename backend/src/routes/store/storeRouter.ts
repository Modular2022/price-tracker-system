const express = require('express');
const authController = require('../controllers/authController');
const fileController = require('../controllers/fileController');
const storeController = require('../controllers/storeController');

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

module.exports = router;
