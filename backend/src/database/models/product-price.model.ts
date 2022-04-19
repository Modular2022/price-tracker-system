import { DataTypes, Model, NOW } from "sequelize";
import Database from '../db.config';

class ProductPrice extends Model {
  declare id_product_price: number;
  declare product_id: number;
  declare price: number;
  declare date: Date;
}


ProductPrice.init(
  {
    id_product_price: {
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
    price: {
      type: DataTypes.DOUBLE(12, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE, // VARCHAR(255)
      allowNull: false,
      defaultValue: NOW,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'product_prices',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default ProductPrice;