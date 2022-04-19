import { TypeModel } from '../../types/common.t';
import { NextFunction, Response } from 'express';

import AppError from '../../utils/app-error';
import catchAsync from '../../utils/catch-async';
import UserRequestMiddleware from '../../interfaces/user/user-request-middleware.i';
import FileController from './file.controller';

class HandlerFactoryController {


  deleteOne = (Model: TypeModel, modelName: string, key: string) =>
    catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
      const _id: any = {};
      _id[key] = req.params.id;
      const doc = await Model.findOne({ where: _id });
      if (!doc) {
        return next(new AppError(`Not found '${modelName}' with that ID\``, 404));
      }
      if (doc.image) {
        const File = new FileController();
        File.deleteFile(doc.image);
      }
      await doc.destroy();
      res.status(204).json({
        status: 'success',
        data: null,
      });
    });


  updateOne = (Model: TypeModel, modelName: string, key: string) =>
    catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
      const _id: any = {};
      const fields = req.body;
      _id[key] = +req.params.id;
      const doc = await Model.findOne({ where: _id });
      if (!doc) {
        return next(new AppError(`Not found '${modelName}' with that ID`, 404));
      }
      Object.assign(doc, fields);
      await doc.save();
      const data: any = {};
      data[modelName] = doc;
      res.status(200).json({
        status: 'success',
        data,
      });
    });

  createOne = (Model: TypeModel, modelName: string) =>
    catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
      const doc = await Model.create(req.body);
      const data: any = {};
      data[modelName] = doc;
      res.status(201).json({
        status: 'success',
        data,
      });
    });

  getOne = (Model: TypeModel, modelName: string, options: Object) =>
    catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
      const doc = await Model.findOne(options); // id_model: req.params.id
      if (!doc) {
        return next(new AppError(`Not found '${modelName}' with that Id`, 404));
      }
      const data: any = {};
      data[modelName] = doc;
      res.status(200).json({
        status: 'success',
        data,
      });
    });

  getAll = (Model: TypeModel, modelName: string, options: Object | undefined) =>
    catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
      const doc = await Model.findAll(options);
      const data: any = {};
      data[modelName] = doc;
      res.status(200).json({
        status: 'success',
        results: doc.length || 0,
        data,
      });
    });
}

export default HandlerFactoryController;