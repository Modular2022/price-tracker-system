import { DataTypes, Model } from "sequelize";
import Database from '../db.config';

class Department extends Model {
  declare id_department: number;
  declare name: string;
  declare description: string;
}


Department.init(
  {
    id_department: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
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
    description: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'departments',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default Department;