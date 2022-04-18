import { DataTypes, Model, NOW } from "sequelize/types";
import Database from '../db.config';

class ProductReview extends Model {
  declare id_product_review: number;
  declare product_id: number;
  declare user_id: number;
  declare score: number;
}


ProductReview.init(
  {
    id_product_review: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id_product',
      },
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_user',
      },
    },
    score: {
      type: DataTypes.DOUBLE(3, 2),
      allowNull: false,
      validate: {
        max: {
          args: [5],
          msg: 'Review cannot be upper than 5',
        },
        min: {
          args: [1],
          msg: 'Review cannot be lower than 1',
        },
      },
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'product_reviews',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default ProductReview;