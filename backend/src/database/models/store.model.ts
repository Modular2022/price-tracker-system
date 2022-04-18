import { DataTypes, Model } from "sequelize/types";
import Database from '../db.config';

class Denounce extends Model {
  declare id_store: number;
  declare url: string;
  declare name: string;
  declare image: string;
  declare color: string;
}


Denounce.init(
  {
    id_store: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING, // VARCHAR(255)
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: 'Name must be between 1 and 255 characters',
        },
      },
    },
    image: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(6), // VARCHAR(6)
      allowNull: false,
      validate: {
        is: {
          args: /[0-9a-f]+/i,
          msg: 'This is not a valid color',
        },
      },
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'stores',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default Denounce;