import { Response, NextFunction, Request, RequestHandler } from 'express';

import HandlerFactoryController from '../common/handler-factory.controller';
import catchAsync from '../../utils/catch-async';
import ProductImageDBModel from '../../database/models/product-image.model';
import UserRequestMiddleware from '../../interfaces/user/user-request-middleware.i';

export default class ProductImageController {

  handlerFactoryController = new HandlerFactoryController();

  renameFileToUrl = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    if (req.body.image) {
      req.body.url = req.body.image;
      req.body.image = undefined;
    }
    next();
  });

  createProductImage = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    req.body.product_id = req.params.id_product;
    const doc = await ProductImageDBModel.create(req.body);
    const data: any = {};
    data['product_images'] = doc;
    res.status(201).json({
      status: 'success',
      data,
    });
  });

  getAllProductImages = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(ProductImageDBModel, 'product_images', {
      attributes: ['id_product_image', 'image'],
      where: { product_id: req.params.id_product },
    });
    callback(req, res, next);
  };

  getOneProductImage = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getOne(ProductImageDBModel, 'product_image', {
      attributes: ['id_product_image', 'image'],
      where: { id_product_image: req.params.id_image },
    });
    callback(req, res, next);
  };

  updateProductImage = this.handlerFactoryController.updateOne(
    ProductImageDBModel,
    'product_images',
    'id_product_image'
  );

  deleteProductImage = this.handlerFactoryController.deleteOne(
    ProductImageDBModel,
    'product_images',
    'id_product_image'
  );

}