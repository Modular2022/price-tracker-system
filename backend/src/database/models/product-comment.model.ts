import { DataTypes, Model, NOW } from "sequelize";
import Database from '../db.config';

class ProductComment extends Model {
  declare id_comment: number;
  declare product_id: number;
  declare comment_id: number;
  declare user_id: number;
  declare comment: string;
  declare is_active: number;
}


ProductComment.init(
  {
    id_product_comment: {
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
    comment_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'product_comments',
        key: 'id_product_comment',
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
    comment: {
      type: DataTypes.STRING(5000), // VARCHAR(5000)
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN, // TINYINT(1)
      defaultValue: 1,
      allowNull: false,
      validate: {
        isIn: {
          args: [[false, true]],
          msg: 'Active field only accepts "0" and "1"',
        },
      },
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'product_comments',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default ProductComment;