import { DataTypes, Model } from "sequelize/types";
import Database from '../db.config';

class Product extends Model {
  declare id_product: number;
  declare store_id: number;
  declare sku: string;
  declare upc: string;
  declare name: string;
  declare followers: number;
  declare brand: string;
  declare summary: string;
  declare department_id: number;
  declare description: string;
  declare url: string;
}


Product.init(
  {
    id_product: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    store_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'stores',
        key: 'id_store',
      },
    },
    sku: {
      type: DataTypes.STRING(30), // VARCHAR(30)
      allowNull: false,
    },
    upc: {
      type: DataTypes.STRING(30), // VARCHAR(30)
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(500), // VARCHAR(500)
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: 'Name must be between 1 and 500 characters',
        },
      },
    },
    followers: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    brand: {
      type: DataTypes.STRING(100), // VARCHAR(100)
      allowNull: true,
    },
    summary: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: true,
    },
    department_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'id_department',
      },
    },
    description: {
      type: DataTypes.STRING(1000), // VARCHAR(1000)
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(500), // VARCHAR(500)
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'products',
    indexes: [
      {
        unique: true,
        fields: ['store_id', 'sku', 'upc'],
      },
    ],
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default Product;