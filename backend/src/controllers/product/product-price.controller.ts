import { Response, NextFunction, Request, RequestHandler } from 'express';
import { Op } from 'sequelize/types';

import HandlerFactoryController from '../common/handler-factory.controller';
import { DAY_MILLISECONDS, NUMBER_OF_DAYS_GET_AVERAGE, VERY_BIG_NUMBER } from '../../utils/constants';
import ProductPriceDBModel from '../../database/models/product-price.model';

export default class ProductPriceController {

  handlerFactoryController = new HandlerFactoryController();

  createProductPrice = this.handlerFactoryController.createOne(
    ProductPriceDBModel,
    'product_prices'
  );

  getAllProductPrices = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(
      ProductPriceDBModel,
      'product_prices',
      {
        attributes: ['id_product_price', 'product_id', 'price', 'date'],
        where: {
          product_id: req.params.id_product,
          date: {
            [Op.gte]:
              req.query.from ||
              Date.now() - DAY_MILLISECONDS * NUMBER_OF_DAYS_GET_AVERAGE,
          },
        },
        order: [['date', req.query.sorted || 'DESC']],
        limit: +req.query.limit || VERY_BIG_NUMBER,
      }
    );
    callback(req, res, next);
  };

  getOneProductPrice = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getOne(
      ProductPriceDBModel,
      'product_prices',
      {
        attributes: ['id_product_price', 'product_id', 'price', 'date'],
        where: { id_product_price: req.params.id_history },
      }
    );
    callback(req, res, next);
  };

  updateProductPrice = this.handlerFactoryController.updateOne(
    ProductPriceDBModel,
    'product_prices',
    'id_product_price'
  );

  deleteProductPrice = this.handlerFactoryController.deleteOne(
    ProductPriceDBModel,
    'product_prices',
    'id_product_price'
  );
}