import { Response, NextFunction, Request, RequestHandler } from 'express';

import HandlerFactoryController from '../common/handler-factory.controller';
import StoreDBModel from '../../database/models/store.model';

export default class StoreController {

  handlerFactoryController = new HandlerFactoryController();

  createStore = this.handlerFactoryController.createOne(StoreDBModel, 'store');

  getAllStores = (req: Request, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(StoreDBModel, 'stores', {
      attributes: ['id_store', 'url', 'name', 'image', 'color'],
    });
    callback(req, res, next);
  };

  getOneStore = (req: Request, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getOne(StoreDBModel, 'stores', {
      attributes: ['id_store', 'url', 'name', 'image', 'color'],
      where: { id_store: req.params.id_store },
    });
    callback(req, res, next);
  };

  updateStore = this.handlerFactoryController.updateOne(StoreDBModel, 'store', 'id_store');

  deleteStore = this.handlerFactoryController.deleteOne(StoreDBModel, 'store', 'id_store');


}