import { Response, NextFunction, Request, RequestHandler } from 'express';

import HandlerFactoryController from '../common/handler-factory.controller';
import DepartmentDBModel from '../../database/models/department.model';

export default class DepartmentController {

  handlerFactoryController = new HandlerFactoryController();

  createDepartment = this.handlerFactoryController.createOne(DepartmentDBModel, 'department');

  getAllDepartments = (req: Request, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(DepartmentDBModel, 'department', {
      attributes: ['id_department', 'name', 'description'],
    });
    return callback(req, res, next);
  };


  getOneDepartment: RequestHandler = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getOne(DepartmentDBModel, 'department', {
      attributes: ['id_department', 'name', 'description'],
      where: { id_department: req.params.id_department },
    });
    callback(req, res, next);
    return callback;
  };

  updateDepartment = this.handlerFactoryController.updateOne(
    DepartmentDBModel,
    'department',
    'id_department'
  );

  deleteDepartment = this.handlerFactoryController.deleteOne(
    DepartmentDBModel,
    'department',
    'id_department'
  );

}