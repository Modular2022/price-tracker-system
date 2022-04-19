import { DataTypes, Model } from "sequelize";
import Database from '../db.config';

class Theme extends Model {
  declare id_theme: number;
  declare name: string;
  declare main: string;
  declare secondary: string;
  declare text: string;
  declare background: string;
  declare alternative: string;
  declare image: string;
}


Theme.init(
  {
    id_theme: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [1, 255],
          msg: 'Name must be between 1 and 255 characters',
        },
      },
    },
    main: {
      type: DataTypes.STRING(6), // VARCHAR(10)
      allowNull: false,
      validate: {
        is: {
          args: /[0-9a-f]+/i,
          msg: 'This is not a valid color; Field main',
        },
      },
    },
    secondary: {
      type: DataTypes.STRING(6), // VARCHAR(10)
      allowNull: false,
      validate: {
        is: {
          args: /[0-9a-f]+/i,
          msg: 'This is not a valid color; Field secondary',
        },
      },
    },
    text: {
      type: DataTypes.STRING(6), // VARCHAR(10)
      allowNull: false,
      validate: {
        is: {
          args: /[0-9a-f]+/i,
          msg: 'This is not a valid color; Field text_secondary',
        },
      },
    },
    background: {
      type: DataTypes.STRING(6), // VARCHAR(10)
      allowNull: false,
      validate: {
        is: {
          args: /[0-9a-f]+/i,
          msg: 'This is not a valid color; Field background',
        },
      },
    },
    alternative: {
      type: DataTypes.STRING(6), // VARCHAR(10)
      allowNull: false,
      validate: {
        is: {
          args: /[0-9a-f]+/i,
          msg: 'This is not a valid color; Field alternative',
        },
      },
    },
    image: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: false,
      defaultValue: 'searchlock-logo.jpg',
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'themes',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default Theme;