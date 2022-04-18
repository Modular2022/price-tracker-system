import { Response, NextFunction, Request, RequestHandler } from 'express';

import HandlerFactoryController from '../common/handler-factory.controller';
import ProductRequestDBModel from '../../database/models/product-request.model';

export default class ProductController {

  handlerFactoryController = new HandlerFactoryController();

  createProductRequest = this.handlerFactoryController.createOne(
    ProductRequestDBModel,
    'product_request'
  );

  getAllProductRequests = (req: Request, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(ProductRequestDBModel, 'product_request', {
      attributes: ['id_product_request', 'url', 'created_at'],
    });
    callback(req, res, next);
  };

  getOneProductRequest = (req: Request, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getOne(ProductRequestDBModel, 'product_request', {
      attributes: ['id_product_request', 'url', 'created_at'],
      where: { id_product_request: req.params.id_product_request },
    });
    callback(req, res, next);
  };

  deleteProductRequest = this.handlerFactoryController.deleteOne(
    ProductRequestDBModel,
    'addProductRequest',
    'id_product_request'
  );


}