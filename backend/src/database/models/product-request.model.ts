import { DataTypes, Model } from "sequelize";
import Database from '../db.config';

class ProductRequest extends Model {
  declare id_product_request: number;
  declare url: string;
}


ProductRequest.init(
  {
    id_product_request: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING(500), // VARCHAR(10)
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'product_requests',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default ProductRequest;