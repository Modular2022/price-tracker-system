import { ErrorRequestHandler } from "express";

import AppError from '../../utils/app-error';

class GlobalErrorHandler {

  private sendErrorDev: ErrorRequestHandler = (err, req, res) => {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  private sendErrorProd: ErrorRequestHandler = (err, req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      // Operational, trusted error: send message to client
      if (err.isOperational) {
        return next(new AppError(err.message, err.status));
      }
    }
    // Programming or other unknown error: don't leak error details
    return next(new AppError('Something went wrong!', 500));
  };

  public handleErrors: ErrorRequestHandler = (err, req, res, next) => {
    const environment = process.env.NODE_ENV;
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    console.error('An Error has occur', err);

    if (environment === 'development') {
      this.sendErrorDev(err, req, res, next);
    } else {
      this.sendErrorProd(err, req, res, next);
    }
  };
}

export default GlobalErrorHandler;
