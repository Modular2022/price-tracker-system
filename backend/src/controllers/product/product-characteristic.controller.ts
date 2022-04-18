import { Response, NextFunction, Request, RequestHandler } from 'express';

import HandlerFactoryController from '../common/handler-factory.controller';
import ProductCharacteristicDBModel from '../../database/models/product-characteristic.model';

export default class ProductCharacteristicController {

  handlerFactoryController = new HandlerFactoryController();

  createProductCharacteristic = this.handlerFactoryController.createOne(
    ProductCharacteristicDBModel,
    'product_characteristic'
  );

  getAllProductCharacteristics = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(
      ProductCharacteristicDBModel,
      'product_characteristics',
      {
        attributes: [
          'id_characteristic',
          'product_id',
          'property_name',
          'property_value',
        ],
        where: { product_id: req.params.id_product },
      }
    );
    callback(req, res, next);
  };

  getOneProductCharacteristic = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getOne(
      ProductCharacteristicDBModel,
      'product_characteristic',
      {
        attributes: [
          'id_characteristic',
          'product_id',
          'property_name',
          'property_value',
        ],
        where: { id_characteristic: req.params.id_characteristic },
      }
    );
    callback(req, res, next);
  };

  updateProductCharacteristic = this.handlerFactoryController.updateOne(
    ProductCharacteristicDBModel,
    'product_characteristic',
    'id_characteristic'
  );

  deleteProductCharacteristic = this.handlerFactoryController.deleteOne(
    ProductCharacteristicDBModel,
    'product_characteristic',
    'id_characteristic'
  );
}