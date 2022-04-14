import { DataTypes, Model } from 'sequelize';

import Database from '../db.config';

class UserToken extends Model {
  declare id_user: number;
  declare user_id: number;
  declare refresh_token: string;
}

UserToken.init(
  {
    id_user_token: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_user',
      },
    },
    refresh_token: {
      type: DataTypes.STRING(64), // VARCHAR(64)
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'user_tokens',
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

export default UserToken;
