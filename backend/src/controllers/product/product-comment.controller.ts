import { Response, NextFunction, Request, RequestHandler } from 'express';

import HandlerFactoryController from '../common/handler-factory.controller';
import catchAsync from '../../utils/catch-async';
import AppError from '../../utils/app-error';
import ProductCommentDBModel from '../../database/models/product-comment.model';
import UserDBModel from '../../database/models/user.model';


export default class ProductCommentController {

  handlerFactoryController = new HandlerFactoryController();

  private isRequestMadeByCorrectUser = async (req: any, res: Response, next: NextFunction) => {
    try {
      const comment = await ProductCommentDBModel.findOne({
        attributes: ['user_id'],
        where: { id_comment: req.params.id_comment },
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

  createProductComment = (req: any, res: Response, next: NextFunction) => {
    req.body.product_id = req.params.id_product;
    req.body.user_id = req.user.id_user;
    const createOne = this.handlerFactoryController.createOne(ProductCommentDBModel, 'comments');
    createOne(req, res, next);
  };

  createProductCommentResponse = (req: any, res: Response, next: NextFunction) => {
    req.body.product_id = req.params.id_product;
    req.body.comment_id = req.params.id_comment;
    req.body.user_id = req.user.id_user;
    const createOne = this.handlerFactoryController.createOne(ProductCommentDBModel, 'comments');
    createOne(req, res, next);
  };

  // TODO: acomodar bien el req.params.id para que funcione a todas las rutas desde el factory (cambiar nombre)
  updateProductComment = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    if (!(await this.isRequestMadeByCorrectUser(req, res, next))) {
      return next(
        new AppError('You cannot update a comment that is not yours!', 403)
      );
    }
    req.params.id = req.params.id_comment;
    const updateOne = this.handlerFactoryController.updateOne(ProductCommentDBModel, 'comments', 'id_comment');
    updateOne(req, res, next);
  });

  // TODO: implementar paginacion aqui
  getAllProductComments = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(ProductCommentDBModel, 'comments', {
      attributes: [
        'id_comment',
        'comment',
        'is_active',
        'created_at',
        'updated_at',
      ],
      where: { product_id: req.params.id_product, comment_id: null },
      include: [
        {
          model: UserDBModel,
          attributes: ['id_user', 'image', 'full_name', 'is_active'],
          as: 'user',
          separate: false,
          required: true,
        },
      ],
    });
    callback(req, res, next);
  };

  // TODO: implementar paginacion aqui
  getAllProductCommentsResponse = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getAll(ProductCommentDBModel, 'comments', {
      attributes: [
        'id_comment',
        'comment',
        'is_active',
        'created_at',
        'updated_at',
      ],
      where: {
        product_id: req.params.id_product,
        comment_id: req.params.id_comment,
      },
      include: [
        {
          model: UserDBModel,
          attributes: ['id_user', 'image', 'full_name', 'is_active'],
          as: 'user',
          separate: false,
          required: true,
        },
      ],
    });
    callback(req, res, next);
  };

  deleteProductComment = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    if (!(await this.isRequestMadeByCorrectUser(req, res, next))) {
      return next(
        new AppError('You cannot delete a comment that is not yours!', 403)
      );
    }
    req.params.id = req.params.id_comment;
    req.body = { is_active: false };
    const updateOne = this.handlerFactoryController.updateOne(ProductCommentDBModel, 'comments', 'id_comment');
    updateOne(req, res, next);
  });

}