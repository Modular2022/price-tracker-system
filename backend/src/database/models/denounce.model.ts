import { DataTypes, Model } from "sequelize";
import Database from '../db.config';

class Denounce extends Model {
  declare id_denounce: number;
  declare table_name: string;
  declare table_id: number;
  declare reason: string;
}


Denounce.init(
  {
    id_denounce: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    table_name: {
      type: DataTypes.STRING(10), // VARCHAR(10)
      allowNull: false,
      validate: {
        isIn: {
          args: [['comments', 'products', 'users']],
          msg: 'Table must have a name!',
        },
      },
    },
    table_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(500), // VARCHAR(10)
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'denounces',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default Denounce;