import { Response, NextFunction, Request, RequestHandler } from 'express';

import HandlerFactoryController from '../common/handler-factory.controller';
import DenounceDBModel from '../../database/models/denounce.model';

export default class DenounceController {

  handlerFactoryController = new HandlerFactoryController();

  createDenounce = this.handlerFactoryController.createOne(DenounceDBModel, 'denounce');

  getAllDenounces = (req: Request, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(DenounceDBModel, 'denounces', {
      attributes: ['id_denounce', 'table_name', 'table_id', 'created_at'],
    });
    callback(req, res, next);
  };

  getOneDenounce = (req: Request, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getOne(DenounceDBModel, 'denounce', {
      attributes: ['id_denounce', 'table_name', 'table_id', 'created_at'],
      where: { id_denounce: req.params.id_product_request },
    });
    callback(req, res, next);
  };

  deleteDenounce = this.handlerFactoryController.deleteOne(DenounceDBModel, 'denounce', 'id_denounce');

}