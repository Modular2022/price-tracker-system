import { Op } from 'sequelize';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import catchAsync from '../../utils/catch-async';
import AppError from '../../utils/app-error';
import Email from '../../utils/email';
import UserDBModel from '../../database/models/user.model';
import UserToken from '../../database/models/user-token.model';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import UserRequestMiddleware from '../../interfaces/user/user-request-middleware.i';

class AuthController {

  private secret;
  constructor() {
    this.secret = process.env.JWT_SECRET || '';
  }

  private signToken(id: number): string {
    return jwt.sign(
      {
        id,
      },
      this.secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  }

  private checkIsToken(req: Request): string {
    // get token and check of it's there
    let token = '';
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    return token;
  }

  private createSendToken(user: UserDBModel, statusCode: number, res: Response): void {
    const token = this.signToken(user.id_user);
    const refreshToken = user.createRefreshToken();
    user.save().then((updatedUser) => {
      res.status(statusCode).json({
        status: 'success',
        token,
        refresh_token: refreshToken,
        data: {
          User: updatedUser,
        },
      });
    });
  }

  public signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { createdUser, resetToken } = await userController.createUser(
      req,
      res,
      next
    );
    const url = `${req.protocol}://${process.env.FRONTEND_ENDPOINT}/login`;
    await new Email(createdUser, url).sendWelcome();
    const token = this.signToken(createdUser.id_user);
    res.status(201).json({
      status: 'success',
      token,
      refresh_token: resetToken,
      data: {
        message: 'User created successfully, check the Email!.',
        id_user: createdUser.id_user,
        full_name: createdUser.full_name,
        role: createdUser.role,
        image: createdUser.image,
      },
    });
  });

  public login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    // check if email and passwords exists
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // check if user exists && password is correct
    const user = await UserDBModel.findOne({
      attributes: [
        'id_user',
        'full_name',
        'password',
        'role',
        'image',
        'is_active',
      ],
      where: { email: email },
    });
    if (!user || !(await UserDBModel.isCorrectPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
    //if user is banned or deleted
    if (!user.is_active) {
      return next(new AppError('User Banned or deleted!', 401));
    }
    // if everything is ok, send token to client
    this.createSendToken(user, 200, res);
  });


  public logout = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    const user = await UserDBModel.findOne({
      attributes: ['id_user'],
      where: {
        id_user: req.user.id_user,
      },
    });
    if (!user) {
      return next(new AppError(`invalid data (please check the token)`, 404));
    }
    await UserToken.destroy({
      where: {
        user_id: user.id_user,
      },
    });
    res.status(200).json({ status: 'success' });
  });

  public protect = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    // get token and check of it's there
    const token = this.checkIsToken(req);
    let decoded: any;
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access', 401)
      );
    }
    // verification token
    try {
      decoded = jwt.verify(token, this.secret);
    } catch (error) {
      return next(
        new AppError('Bad Token, please login again or update token', 401)
      );
    }

    // check if user still exists
    const currentUser = await UserDBModel.findOne({
      attributes: ['id_user', 'role', 'is_active'],
      where: { id_user: decoded.id },
    });
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does not longer exist',
          401
        )
      );
    }
    //if user is banned or deleted
    if (!currentUser.is_active) {
      return next(new AppError('User Banned or deleted!', 401));
    }
    // check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again!', 401)
      );
    }

    // grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  });

  public restrictTo = (...roles: string[]): any => (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      );
    }
    next();
  };

  public forgotPassword = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    // get user based on posted email
    const user = await UserDBModel.findOne({
      attributes: ['id_user', 'role', 'full_name', 'email', 'is_active'],
      where: { email: req.body.email },
    });
    if (!user) {
      return next(new AppError('There is no user with that email address.', 404));
    }
    //if user is banned or deleted
    if (!user.is_active) {
      return next(new AppError('User Banned or deleted!', 401));
    }
    // generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();
    try {
      //send it to user's email
      const resetURL = `${req.protocol}://${process.env.FRONTEND_ENDPOINT}/auth/reset-password/${resetToken}`;
      await new Email(user, resetURL).sendPasswordReset();
      res.status(200).json({
        status: 'success',
        resetToken,
        resetURL,
        message: `Token sent to email!`,
      });
    } catch (err) {
      user.token_forgot_password = '';
      user.token_forgot_password_expires_at = new Date();
      await user.save();
      return next(
        new AppError('There was an error sending the email. Try again later', 500)
      );
    }
  });

  public resetPassword = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    // get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await UserDBModel.findOne({
      attributes: ['id_user', 'role'],
      where: {
        token_forgot_password: hashedToken,
        token_forgot_password_expires_at: { [Op.gt]: Date.now() },
      },
    });
    // if token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    // update properties for the user
    user.password = req.body.password;
    user.token_forgot_password = '';
    user.token_forgot_password_expires_at = new Date();
    // todo: validar que sea contraseña correcta
    await user.encryptPassword();
    await user.save();

    await UserToken.destroy({
      where: {
        user_id: user.id_user,
      },
    });

    // log the user in, send JWT
    this.createSendToken(user, 200, res);
  });

  public updatePassword = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    // get user from collection
    const user = await UserDBModel.findOne({
      attributes: ['id_user', 'role', 'password'],
      where: {
        id_user: req.user.id_user,
      },
    });
    if (!user) {
      return next(new AppError('That user does not exist', 400));
    }
    // check if posted password is correct
    if (!(await user.correctPassword(req.body.actual_password, user.password))) {
      return next(new AppError('Your current password is wrong', 401));
    }
    // if password is correct, then update
    user.password = req.body.password;
    // TODO: validar que la nueva contraseña sea valida
    await user.encryptPassword();
    await user.save();
    // log user in, send JWT
    this.createSendToken(user, 200, res);
  });

  public verifyToken = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    // get token and check of it's there
    const token = this.checkIsToken(req);
    let decoded;
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in again', 401)
      );
    }
    try {
      decoded = jwt.verify(token, this.secret);
    } catch (error) {
      return next(
        new AppError('Bad Token, please login again or update token', 401)
      );
    }
    res.status(200).json({ status: 'success', message: decoded });
  });

  public updateToken = catchAsync(async (req: UserRequestMiddleware, res: Response, next: NextFunction) => {
    const token = this.checkIsToken(req);
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in again', 401)
      );
    }
    const decoded: any = jwt.decode(token);
    if (!decoded) {
      return next(new AppError('Wrong token, Please log in again!', 400));
    }
    const user = await UserDBModel.findOne({
      attributes: ['id_user', 'role', 'is_active'],
      where: {
        id_user: decoded.id,
      },
    });
    if (!user) {
      return next(
        new AppError('This user does not exist, Please log in again!', 400)
      );
    }
    //if user is banned or deleted
    if (!user.is_active) {
      return next(new AppError('User Banned or deleted!', 401));
    }
    const userTokens = await UserToken.findAll({
      where: { user_id: user.id_user },
      raw: true,
    });
    const tokenExist = userTokens.filter(
      (values) => values.refresh_token === req.body.refresh_token
    );
    if (tokenExist.length === 1) {
      res.status(200).json({ status: 'success', token: this.signToken(user.id_user) });
    } else {
      next(new AppError('You are not logged in! Please log in again', 401));
    }
  });

}

export default AuthController;