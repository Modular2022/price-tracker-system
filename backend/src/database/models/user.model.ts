import { DataTypes, Model } from 'sequelize';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import Database from '../db.config';
import UserTokenDBModel from './user-token.model';

class User extends Model {
  declare id_user: number;
  declare role: string;
  declare full_name: string;
  declare email: string;
  declare password: string;
  declare image: string;
  declare is_active: boolean;
  declare password_changed_at: Date;
  declare token_forgot_password: string;
  declare token_forgot_password_expires_at: Date;



  static async isCorrectPassword(candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }

  createRefreshToken() {
    const token = crypto.randomBytes(35).toString('hex');
    const refreshToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    UserTokenDBModel.create({
      user_id: this.id_user,
      refresh_token: refreshToken,
    })
      // eslint-disable-next-line no-unused-vars
      .then((query) => {
        // do nothing
      })
      .catch((err) => {
        console.error(err);
      });
    return refreshToken;
  }

  changedPasswordAfter(JWTTimestamp: number) {
    if (this.password_changed_at) {
      const changedTimestamp = parseInt(
        `${this.password_changed_at.getTime() / 1000}`,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  }

  createPasswordResetToken() {
    const resetToken = crypto.randomBytes(35).toString('hex');
    this.token_forgot_password = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.token_forgot_password_expires_at = new Date(new Date().getTime() + (10 * 60 * 1000));
    return resetToken;
  }

  async encryptPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async correctPassword(candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
}

User.init(
  {
    id_user: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      // validate: {
      //   notNull: {
      //     msg: 'User must have an ID',
      //   },
      // },
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING(10), // VARCHAR(10)
      allowNull: false,
      validate: {
        isIn: {
          args: [['admin', 'moderator', 'user']],
          msg: 'User must have a role!',
        },
      },
      defaultValue: 'user',
    },
    full_name: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: false,
      validate: {
        len: {
          args: [2, 255],
          msg: 'Name must be between 2 characters and 255',
        },
      },
    },
    email: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Put a valid Email format',
        },
      },
    },
    password: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: false,
      validate: {
        len: {
          args: [2, 255],
          msg: 'Password must be between 2 characters and 255',
        },
      },
    },
    image: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: false,
      defaultValue: 'avatar.jpg',
    },
    is_active: {
      type: DataTypes.BOOLEAN, // TINYINT(1)
      defaultValue: 1,
      allowNull: false,
      validate: {
        isIn: {
          args: [[false, true]],
          msg: 'Active field only accepts "0" and "1"',
        },
      },
    },
    password_changed_at: {
      type: DataTypes.DATE, // DATETIME
      allowNull: true,
    },
    token_forgot_password: {
      type: DataTypes.STRING, // VARCHAR(255)
      allowNull: true,
    },
    token_forgot_password_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    sequelize: Database.sequelize,
    tableName: 'users',
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] },
      },
    },
    underscored: true, // auto-created fields in database are created in lowercase_separated_by_underscores notation
  }
);

User.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 12);
});

// User.beforeCreate('save', function (next) {
//   if (!this.isModified('password') || this.isNew) {
//     return next();
//   }
//   this.password_changed_at = Date.now() - 1000;
//   next();
// });

export default User;
