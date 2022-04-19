import { Request } from "express";
import UserDBModel from "../../database/models/user.model";

export default interface UserRequestMiddleware extends Request {
  user: UserDBModel;
}