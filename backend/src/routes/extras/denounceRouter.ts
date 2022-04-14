const express = require('express');
const authController = require('../controllers/authController');
const denounceController = require('../controllers/denounceController');

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

module.exports = router;
