import { Options, Sequelize } from 'sequelize';
import dotenv from "dotenv";

dotenv.config({
  path: __dirname + '/../../config.env',
});

class Database {

  private static dbConfig: Options = {
    database: process.env.DB_DATABASE || '',
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    pool: {
      max: 10, // Maximum number of connection in pool
      min: 0, // Minimum number of connection in pool
      idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released.
      acquire: 60000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    },
    logging: console.log, // show log messages in terminal each request
  };

  static sequelize: Sequelize = new Sequelize(Database.dbConfig);

  constructor() { }


  private createDBRelationships(secuelize: any) {
    secuelize.models.Product.hasMany(
      secuelize.models.ProductPrice,
      {
        foreignKey: 'product_id',
        as: 'prices',
      }
    );
    secuelize.models.Product.hasMany(
      secuelize.models.ProductCharacteristic,
      {
        foreignKey: 'product_id',
        as: 'characteristics',
      }
    );
    secuelize.models.Product.hasMany(secuelize.models.ProductImage, {
      foreignKey: 'product_id',
      as: 'images',
    });
    secuelize.models.Product.hasMany(secuelize.models.ProductReview, {
      foreignKey: 'product_id',
      as: 'product_reviews',
    });
    secuelize.models.Product.hasMany(
      secuelize.models.UserWishlistModel,
      {
        foreignKey: 'product_id',
        as: 'wishlist',
      }
    );
    secuelize.models.Department.hasMany(secuelize.models.Product, {
      foreignKey: 'department_id',
      as: 'products',
    });
    secuelize.models.Store.hasMany(secuelize.models.Product, {
      foreignKey: 'store_id',
      as: 'products',
    });
    secuelize.models.User.hasMany(secuelize.models.UserWishlistModel, {
      foreignKey: 'user_id',
      as: 'wishlist',
    });

    secuelize.models.ProductComment.belongsTo(secuelize.models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    secuelize.models.Product.belongsTo(secuelize.models.Store, {
      foreignKey: 'store_id',
      as: 'store',
    });
    secuelize.models.Product.belongsTo(secuelize.models.Department, {
      foreignKey: 'department_id',
      as: 'department',
    });
    secuelize.models.ProductReview.belongsTo(secuelize.models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
    secuelize.models.UserWishlistModel.belongsTo(
      secuelize.models.Product,
      {
        foreignKey: 'product_id',
        as: 'product',
      }
    );
    return secuelize;
  }

  public async initialize() {
    try {
      const secuelizeRelationships = this.createDBRelationships(Database.sequelize);
      const connectionMsg = await secuelizeRelationships.authenticate();
      const syncMsg = await secuelizeRelationships.sync();
      console.log(`Connection to database established - ${connectionMsg} - ${syncMsg}`);
    } catch (error) {
      console.error(error);
      process.exit(1); // code 1 is for unhandled rejection, 0 means success
    }
  }
}

export default Database;
