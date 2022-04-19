import UserWishlistDBModel from "../../database/models/user-wishlist.model";

export default interface UserWishlistResponse {
  wishlist?: UserWishlistDBModel[];
}