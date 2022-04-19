import { RequestHandler } from "express";

export default (fn: Function): RequestHandler => {
  const routeHandler: RequestHandler = (req, res, next) => {
    try {
      fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
  return routeHandler;
}