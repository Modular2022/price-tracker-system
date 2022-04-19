import { DataTypes, Model } from "sequelize";
import Database from '../db.config';

class ProductCharacteristic extends Model {
  declare id_characteristic: number;
  declare product_id: number;
  declare property_name: string;
  declare property_value: string;
}


ProductCharacteristic.init(
  {
    id_characteristic: {
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
    property_name: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: false,
    },
    property_value: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'product_characteristics',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default ProductCharacteristic;