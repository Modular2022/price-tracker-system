import { Response, NextFunction, Request, RequestHandler } from 'express';

import HandlerFactoryController from '../common/handler-factory.controller';
import ThemeDBModel from '../../database/models/theme.model';
import AppConfigDBModel from '../../database/models/app-configuration.model';
import catchAsync from '../../utils/catch-async';
import AppError from '../../utils/app-error';

export default class ThemeController {

  handlerFactoryController = new HandlerFactoryController();

  createTheme = this.handlerFactoryController.createOne(ThemeDBModel, 'theme');

  getAllThemes = (req: Request, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(ThemeDBModel, 'themes', {
      attributes: [
        'id_theme',
        'name',
        'main',
        'secondary',
        'text',
        'background',
        'alternative',
        'image',
      ],
    });
    callback(req, res, next);
  };

  getOneTheme = (req: Request, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getOne(ThemeDBModel, 'theme', {
      attributes: [
        'id_theme',
        'name',
        'main',
        'secondary',
        'text',
        'background',
        'alternative',
        'image',
      ],
      where: { id_theme: req.params.id_theme },
    });
    callback(req, res, next);
  };

  updateTheme = this.handlerFactoryController.updateOne(ThemeDBModel, 'theme', 'id_theme');

  deleteTheme = this.handlerFactoryController.deleteOne(ThemeDBModel, 'theme', 'id_theme');

  getDefaultTheme = (req: Request, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(AppConfigDBModel, 'default_theme', undefined);
    callback(req, res, next);
  };

  setDefaultTheme = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const theme = await ThemeDBModel.findOne({ where: req.body.default_theme });
    if (!theme) {
      return next(new AppError(`Not found theme with that Id`, 404));
    }
    const doc = await AppConfigDBModel.update(
      { default_theme: req.body.default_theme },
      { where: { default_theme: 1 } }
    );
    if (!doc) {
      return next(new AppError(`Something went wrong`, 500));
    }
    res.status(200).json({
      status: 'success',
      data: { theme },
    });
  });


}