import { DataTypes, Model, NOW } from "sequelize";
import Database from '../db.config';

class ProductImage extends Model {
  declare id_product_image: number;
  declare product_id: number;
  declare image: string;
}


ProductImage.init(
  {
    id_product_image: {
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
    image: {
      type: DataTypes.STRING(500), // VARCHAR(500)
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'product_images',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default ProductImage;