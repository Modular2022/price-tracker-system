import Product from "../database/models/product.model";
import UserToken from "../database/models/user-token.model";
import UserWishlist from "../database/models/user-wishlist.model";
import User from "../database/models/user.model";

export type TypeModel = User | Product | UserToken | UserWishlist | any;