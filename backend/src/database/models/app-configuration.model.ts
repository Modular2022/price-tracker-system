import { DataTypes, Model } from "sequelize/types";
import Database from '../db.config';

class AppConfiguration extends Model {
  declare id_app_configuration: number;
  declare configuration_key: string;
  declare configuration_value: string;
}


AppConfiguration.init(
  {
    id_app_configuration: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    configuration_key: {
      type: DataTypes.STRING(50), // VARCHAR(10)
      unique: true,
      allowNull: false,
    },
    configuration_value: {
      type: DataTypes.STRING(500), // VARCHAR(500)
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: 'Value must be between 1 and 500 characters',
        },
      },
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'app_configurations',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default AppConfiguration;