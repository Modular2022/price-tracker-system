import { DataTypes, Model } from 'sequelize';

import Database from '../db.config';

class UserWishlistModel extends Model {
  declare id_user_wishlist: number;
  declare user_id: number;
  declare product_id: number;
  declare created_at: Date;
  declare updated_at: Date;
}

UserWishlistModel.init(
  {
    id_user_wish_product: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_user',
      },
    },
    product_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id_product',
      },
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'user_wishlist',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'product_id'],
      },
    ],
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default UserWishlistModel;
