import UserDBModel from "../../database/models/user.model";

export default interface UserResponse {
  users?: UserDBModel[];
}