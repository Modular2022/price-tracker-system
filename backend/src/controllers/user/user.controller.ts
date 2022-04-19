import { RequestHandler, Response, NextFunction, Request } from 'express';
import crypto from 'crypto';

import AppError from '../../utils/app-error';
import catchAsync from '../../utils/catch-async';
import ProductDBModel from '../../database/models/product.model';
import UserDBModel from '../../database/models/user.model';
import { LIMIT_DEFAULT, OFFSET_DEFAULT } from '../../utils/constants';
import UserWishlistDBModel from '../../database/models/user-wishlist.model';
import UserTokenDBModel from '../../database/models/user-token.model';
import UserRequestMiddleware from '../../interfaces/user/user-request-middleware.i';
import UserResponse from '../../interfaces/user/user-response.i';
import UserWishlistResponse from '../../interfaces/user/user-wishlist-response.i';

export default class UserController {

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<{ createdUser: UserDBModel, resetToken: string }> => {
    const createdUser = await UserDBModel.create({
      full_name: req.body.full_name,
      email: req.body.email,
      password: req.body.password,
    });
    const resetToken = crypto.randomBytes(35).toString('hex');
    const refreshToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    await UserTokenDBModel.create({
      user_id: createdUser.id_user,
      refresh_token: refreshToken,
    });
    return { createdUser, resetToken };
  };

  getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc: UserDBModel[] = await UserDBModel.findAll({
      attributes: [
        'id_user',
        'role',
        'full_name',
        'image',
        'created_at',
        'email',
        'is_active',
      ],
      limit: Number(req.query.limit) || LIMIT_DEFAULT,
      offset: Number(req.query.offset) || OFFSET_DEFAULT,
    });
    const data: UserResponse = {};
    data.users = doc;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data,
    });
  });

  getOneUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await UserDBModel.findOne({
      attributes: [
        'id_user',
        'role',
        'full_name',
        'email',
        'image',
        'is_active',
        'password_changed_at',
        'token_forgot_password',
        'token_forgot_password_expires_at',
        'created_at',
      ],
      where: { id_user: req.params.id },
    });
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

  addProductToWishlist = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    const doc: UserWishlistDBModel = await UserWishlistDBModel.create({
      user_id: req.user.id_user,
      product_id: req.params.id_product,
    });
    const prod = await ProductDBModel.findOne({
      where: { id_product: req.params.id_product },
    });
    // updates followers on product model
    if (prod) {
      Object.assign(prod, { followers: prod.followers + 1 });
      await doc.save();
    }
    const data: UserWishlistResponse = {};
    data.wishlist = [doc];
    res.status(201).json({
      status: 'success',
      data,
    });
  });

  getWishListOfUser = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    const doc = await UserWishlistDBModel.findAll({
      where: { user_id: req.user.id_user },
      limit: Number(req.query.limit) || LIMIT_DEFAULT,
      offset: Number(req.query.offset) || OFFSET_DEFAULT,
    });
    const data: any = {};
    data.wishlist = doc;
    res.status(200).json({
      status: 'success',
      results: doc.length || 0,
      data,
    });
  });

  removeProductFromWishlist = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    const doc = await UserWishlistDBModel.findOne({
      where: { product_id: req.params.id_product, user_id: req.user.id_user },
    });
    const prod = await ProductDBModel.findOne({
      where: { id_product: req.params.id_product },
    });
    if (!doc) {
      return next(
        new AppError(`Not found wish-product with that product ID\``, 404)
      );
    }
    // updates followers on product model
    if (prod) {
      Object.assign(prod, { followers: prod.followers - 1 });
      await doc.save();
    }
    await doc.destroy();
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  banUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await UserDBModel.findOne({ where: { id_user: req.params.id } });
    if (!doc) {
      return next(new AppError(`Not found User with that ID`, 404));
    }
    Object.assign(doc, { is_active: 0 });
    await doc.save();
    const data: any = {};
    data.user = doc;
    res.status(200).json({
      status: 'success',
      data,
    });
  });

}