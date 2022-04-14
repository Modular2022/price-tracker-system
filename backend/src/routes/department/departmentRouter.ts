import express from 'express';
import AuthController from '../../controllers/auth/auth.controller';
import DepartmentController from '../../controllers/department/department.controller';

const authController = new AuthController();
const departmentController = new DepartmentController();

const router = express.Router();

router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  departmentController.createDepartment
);

router.get('/', departmentController.getAllDepartments);

router.get('/:id_department', departmentController.getOneDepartment);

router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  departmentController.deleteDepartment
);

router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin'),
  departmentController.updateDepartment
);

module.exports = router;
