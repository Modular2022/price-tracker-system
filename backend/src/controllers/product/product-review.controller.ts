import { Response, NextFunction, Request, RequestHandler } from 'express';

import HandlerFactoryController from '../common/handler-factory.controller';
import ProductReviewDBModel from '../../database/models/product-review.model';
import catchAsync from '../../utils/catch-async';
import AppError from '../../utils/app-error';
import { col, fn } from 'sequelize/types';

export default class ProductReviewController {

  handlerFactoryController = new HandlerFactoryController();

  private isRequestMadeByCorrectUser = async (req: any, res: Response, next: NextFunction) => {
    try {
      const comment = await ProductReviewDBModel.findOne({
        attributes: ['user_id'],
        where: { id_review: req.params.id_review },
      });
      if (req.user.role === 'user') {
        if (req.user.id_user !== comment?.user_id) {
          return false;
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  createProductReview = (req: any, res: Response, next: NextFunction) => {
    req.body.product_id = req.params.id_product;
    req.body.user_id = req.user.id_user;
    const createOne = this.handlerFactoryController.createOne(ProductReviewDBModel, 'reviews');
    createOne(req, res, next);
  };

  updateProductReview = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    req.params.id = req.params.id_review;
    const updateOne = this.handlerFactoryController.updateOne(ProductReviewDBModel, 'reviews', 'id_product_review');
    updateOne(req, res, next);
  });

  getAllProductReviews = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const doc = await ProductReviewDBModel.findAll({
      attributes: [
        [fn('COUNT', col('id_review')), 'reviews'],
        [fn('AVG', col('score')), 'average'],
      ],
      where: { product_id: req.params.id_product },
    });
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        reviews: doc[0],
      },
    });
  });

  getMyProductReview = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getOne(ProductReviewDBModel, 'product_review', {
      where: { product_id: req.params.id_product, user_id: req.user.id_user },
    });
    callback(req, res, next);
  };

  deleteProductReview = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    if (!(await this.isRequestMadeByCorrectUser(req, res, next))) {
      return next(
        new AppError('You cannot update a review that is not yours!', 403)
      );
    }
    req.params.id = req.params.id_review;
    const deleteOne = this.handlerFactoryController.deleteOne(ProductReviewDBModel, 'reviews', 'id_product_review');
    deleteOne(req, res, next);
  });

}