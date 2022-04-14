import { RequestHandler, Response, NextFunction, Request } from 'express';
import crypto from 'crypto';

import AppError from '../../utils/app-error';
import catchAsync from '../../utils/catch-async';
import ProductDBModel from '../../database/models/product.model';
import UserDBModel from '../../database/models/user.model';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../../utils/constants';
import UserWishlistDBModel from '../../database/models/user-wishlist.model';
import UserTokenDBModel from '../../database/models/user-token.model';
import UserRequestMiddleware from '../../interfaces/user/user-request-middleware.i';
import UserResponse from '../../interfaces/user/user-response.i';
import UserWishlistResponse from '../../interfaces/user/user-wishlist-response.i';

export default class DepartmentController {

  createDepartment = factory.createOne(Department, 'department');

  getAllDepartments = (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    const callback = factory.getAll(Department, 'department', {
      attributes: ['id_department', 'name', 'description'],
    });
    callback(req, res, next);
  };

  getOneDepartment = (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    const callback = factory.getOne(Department, 'department', {
      attributes: ['id_department', 'name', 'description'],
      where: { id_department: req.params.id_department },
    });
    callback(req, res, next);
  };

  updateDepartment = factory.updateOne(
    Department,
    'department',
    'id_department'
  );

  deleteDepartment = factory.deleteOne(
    Department,
    'department',
    'id_department'
  );

}