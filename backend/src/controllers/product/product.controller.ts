import { Response, NextFunction, Request, RequestHandler } from 'express';
import { QueryTypes, Sequelize } from 'sequelize';

import HandlerFactoryController from '../common/handler-factory.controller';
import StoreDBModel from '../../database/models/store.model';
import catchAsync from '../../utils/catch-async';
import DepartmentDBModel from '../../database/models/department.model';
import ProductCharacteristicsDBModel from '../../database/models/product-characteristic.model';
import ProductDBModel from '../../database/models/product.model';
import { DAY_MILLISECONDS, DEFAULT_PRODUCT_SCORE, LIMIT_DEFAULT, NUMBER_OF_DAYS_GET_AVERAGE, OFFSET_DEFAULT } from '../../utils/constants';
import ProductPriceDBModel from '../../database/models/product-price.model';
import ProductImageBDModel from '../../database/models/product-image.model';
import Database from '../../database/db.config';

export default class ProductController {

  handlerFactoryController = new HandlerFactoryController();

  getWhereOfQuery = (req: Request) => {
    let whereQuery = ` where true `;
    if (req.params.id) {
      whereQuery += ` and Product.id_product = ${req.params.id} `;
    }
    if (req.query.department) {
      console.log(req.query.department);
      whereQuery += ` and Department.id_department in(${req.query.department}) `;
    }
    if (req.query.min_price) {
      console.log(req.query.min_price);
      whereQuery += ` and PHP.price >= ${req.query.min_price} `;
    }
    if (req.query.max_price) {
      console.log(req.query.max_price);
      whereQuery += ` and PHP.price <= ${req.query.max_price} `;
    }

    return whereQuery;
  };

  createProduct = this.handlerFactoryController.createOne(ProductDBModel, 'product');

  createProductScrapper = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const { store, department, images, characteristics } = req.body;
    const storeDB = await StoreDBModel.findOne({
      attributes: ['id_store'],
      where: { name: store },
    });
    // findOrCreate returns an array
    const departmentDB = (
      await DepartmentDBModel.findOrCreate({
        attributes: ['id_department'],
        where: { name: department },
        defaults: { name: department, description: '' },
      })
    )[0];
    const newProduct = {
      store_id: storeDB?.id_store,
      sku: req.body.sku,
      upc: req.body.upc,
      name: req.body.name,
      brand: req.body.brand,
      summary: req.body.summary,
      department_id: departmentDB.id_department,
      description: req.body.description,
      url: req.body.url,
    };
    const productDB = await ProductDBModel.create(newProduct);
    const characteristicsArr = Object.keys(characteristics).map((value) => ({
      product_id: productDB.id_product,
      property_name: value,
      property_value: characteristics[value],
    }));
    const productCharacteristicsArray = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const value of characteristicsArr) {
      const characteristic = await ProductCharacteristicsDBModel.create({
        product_id: value.product_id,
        property_name: value.property_name,
        property_value: value.property_value,
      });
      productCharacteristicsArray.push(characteristic);
    }
    const priceDB = await ProductPriceDBModel.create({
      product_id: productDB.id_product,
      price: req.body.price,
    });
    const imagesArr = images.map((value: string) => ({
      product_id: productDB.id_product,
      image: value,
    }));
    const imagesDB = await ProductImageBDModel.bulkCreate(imagesArr);
    const data = {
      product: {
        product: productDB,
        images: imagesDB,
        price: priceDB,
        characteristics: productCharacteristicsArray,
      },
    };
    res.status(200).json({
      status: 'success',
      data,
    });
  });

  getAllProducts = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const doc = await Database.sequelize.query(
      `
      select 
        Product.id_product,
        Product.name,
        Product.followers, 
        Product.url,
        Average.average,
        Image.image,
        Average.average - PHP.price as discount,
        PHP.date as 'price.date',
        PHP.price as 'price.price',
        Store.name as 'store.name',
        Store.url as 'store.url',
        Store.id_store as 'store.id_store',
        IFNULL(Review.score, ${DEFAULT_PRODUCT_SCORE}) as 'score',
        IFNULL(Vote.votes, 0) as 'votes',
        Department.name as 'department.name',
        Department.id_department as 'department.id_department'
       from products as Product
        inner join 
          (
            select sub.product_id, avg(sub.price) as average from
              (
              SELECT * FROM 
                (
                  select *, row_number() over(partition by product_id order by date desc) as pr
                    from product_history_prices
                ) AS Price
                where Price.date >= ${Date.now() - DAY_MILLISECONDS * NUMBER_OF_DAYS_GET_AVERAGE}
              ) as sub 
              group by sub.product_id
              order by average
          ) as Average on Product.id_product = Average.product_id
        inner join product_history_prices as PHP on PHP.product_id = Product.id_product
        left join (
          select product_id, avg(score) as score from product_reviews
          group by product_id
        ) as Review on Review.product_id = Product.id_product
        left join (
          select product_id, COUNT(score) as votes from product_reviews
          group by product_id
        ) as Vote on Vote.product_id = Product.id_product
        inner join stores as Store on Product.store_id = Store.id_store
        inner join departments as Department on Product.department_id = Department.id_department
        inner join
        (
          select product_id, max(id_product_history_price) as id_product_history_price
          from product_history_prices 
          group by product_id
        ) as ProductHistoryPrice on ProductHistoryPrice.id_product_history_price = PHP.id_product_history_price
        left join 
          (
            select min(ProductImage.created_at) as date, min(ProductImage.id_product_image) as id, ProductImage.product_id
            from product_images as ProductImage
            group by ProductImage.product_id
          ) as ImageId on ImageId.product_id = Product.id_product
        left join product_images as Image on ImageId.id = Image.id_product_image
        ${this.getWhereOfQuery(req)}
        order by discount desc
        limit ${+req.query.limit || LIMIT_DEFAULT}
        offset ${+req.query.offset || OFFSET_DEFAULT}
      `,
      {
        nest: true,
        type: QueryTypes.SELECT,
      }
    );
    const data: any = {};
    data.products = doc;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data,
    });
  });

  searchProduct = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const doc = await Database.sequelize.query(
      `
      select 
        Product.id_product,
        Product.name,
        Product.followers, 
        Product.url,
        Average.average,
        Image.image,
        Average.average - PHP.price as discount,
        PHP.date as 'price.date',
        PHP.price as 'price.price',
        Store.name as 'store.name',
        Store.url as 'store.url',
        Store.id_store as 'store.id_store',
        IFNULL(Review.score, ${DEFAULT_PRODUCT_SCORE}) as 'score',
        IFNULL(Vote.votes, 0) as 'votes',
        Department.name as 'department.name',
        Department.id_department as 'department.id_department'
       from products as Product
        inner join 
          (
            select sub.product_id, avg(sub.price) as average from
              (
              SELECT * FROM 
                (
                  select *, row_number() over(partition by product_id order by date desc) as pr
                    from product_history_prices
                ) AS Price
                where Price.date >= ${Date.now() - DAY_MILLISECONDS * NUMBER_OF_DAYS_GET_AVERAGE}
              ) as sub 
              group by sub.product_id
              order by average
          ) as Average on Product.id_product = Average.product_id
        inner join product_history_prices as PHP on PHP.product_id = Product.id_product
        left join (
          select product_id, avg(score) as score from product_reviews
          group by product_id
        ) as Review on Review.product_id = Product.id_product
        left join (
          select product_id, COUNT(score) as votes from product_reviews
          group by product_id
        ) as Vote on Vote.product_id = Product.id_product
        inner join stores as Store on Product.store_id = Store.id_store
        inner join departments as Department on Product.department_id = Department.id_department
        inner join
        (
          select product_id, max(id_product_history_price) as id_product_history_price
          from product_history_prices 
          group by product_id
        ) as ProductHistoryPrice on ProductHistoryPrice.id_product_history_price = PHP.id_product_history_price
        left join 
          (
            select min(ProductImage.created_at) as date, min(ProductImage.id_product_image) as id, ProductImage.product_id
            from product_images as ProductImage
            group by ProductImage.product_id
          ) as ImageId on ImageId.product_id = Product.id_product
        left join product_images as Image on ImageId.id = Image.id_product_image
        inner join (
          select products.*, match(name, summary) against ('${req.params.name}'  IN NATURAL LANGUAGE MODE) as score 
          from  products 
          where match(name, summary) against ('${req.params.name}'  IN NATURAL LANGUAGE MODE) 
          and   match(name, summary) against ('${req.params.name}'  IN NATURAL LANGUAGE MODE) > 1
        ) as ProductSearch on ProductSearch.id_product = Product.id_product
        ${this.getWhereOfQuery(req)}
        order by discount desc
        limit ${+req.query.limit || LIMIT_DEFAULT}
        offset ${+req.query.offset || OFFSET_DEFAULT}
      `,
      {
        nest: true,
        type: QueryTypes.SELECT,
      }
    );
    const data: any = {};
    data.products = doc;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data,
    });
  });

  getOneProduct = (req: any, res: Response, next: NextFunction) => {
    const callback = this.handlerFactoryController.getOne(ProductDBModel, 'product', {
      attributes: {
        exclude: ['followers', 'createdAt', 'updatedAt'],
      },
      where: {
        id_product: parseInt(req.params.id),
      },
      include: [
        {
          model: ProductImageBDModel,
          attributes: ['image', 'id_product_image'],
          as: 'images',
          separate: false,
          required: false,
        },
        {
          model: StoreDBModel,
          attributes: ['id_store', 'name', 'url', 'image', 'color'],
          as: 'store',
          separate: false,
          required: true,
        },
        {
          model: DepartmentDBModel,
          attributes: ['id_department', 'name', 'description'],
          as: 'department',
          separate: false,
          required: true,
        },
        {
          model: ProductCharacteristicsDBModel,
          attributes: ['id_characteristic', 'property_name', 'property_value'],
          as: 'characteristics',
          separate: false,
          required: false,
        },
        {
          model: ProductPriceDBModel,
          attributes: ['price', 'created_at'],
          as: 'prices',
          // where: {   // TODO: Quitar esto cuando se arregle el scrapper
          //   date: {
          //     [Sequelize.Op.gte]:
          //       Date.now() - DAY_MILLISECONDS * NUMBER_OF_DAYS_GET_AVERAGE,
          //   },
          // },
          separate: false,
          required: true,
        },
      ],
    });
    callback(req, res, next);
  };

  updateProduct = this.handlerFactoryController.updateOne(ProductDBModel, 'product', 'id_product');

  updateProductScrapper = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    const { store, department, images, characteristics } = req.body;
    const storeDB = await StoreDBModel.findOne({
      attributes: ['id_store'],
      where: { name: store },
    });
    // findOrCreate returns an array
    const departmentDB = (
      await DepartmentDBModel.findOrCreate({
        attributes: ['id_department'],
        where: { name: department },
        defaults: { name: department, description: '' },
      })
    )[0];
    const newProduct = {
      store_id: storeDB?.id_store,
      sku: req.body.sku,
      upc: req.body.upc,
      name: req.body.name,
      brand: req.body.brand,
      summary: req.body.summary,
      department_id: departmentDB.id_department,
      description: req.body.description,
      url: req.body.url,
    };
    const productDB = (await ProductDBModel.findOrCreate({
      attributes: ['id_product'],
      where: {
        sku: req.query.sku,
        upc: req.query.upc,
        store_id: storeDB?.id_store
      },
      defaults: newProduct,
    }))[0];
    const characteristicsArr = Object.keys(characteristics).map((value) => ({
      product_id: productDB.id_product,
      property_name: value,
      property_value: characteristics[value],
    }));
    const productCharacteristicsArray = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const value of characteristicsArr) {
      const characteristic = await ProductCharacteristicsDBModel.findOrCreate({
        where: {
          product_id: value.product_id,
          property_name: value.property_name,
          property_value: value.property_value,
        }
      });
      productCharacteristicsArray.push(characteristic);
    }
    const priceDB = await ProductPriceDBModel.create({
      product_id: productDB.id_product,
      price: req.body.price,
    });
    // const imagesArr = images.map((value) => ({
    //   product_id: productDB.id_product,
    //   image: value,
    // }));
    // const imagesDB = await ProductImages.bulkCreate(imagesArr);
    const data = {
      product: {
        product: productDB,
        // images: imagesDB,
        price: priceDB,
        characteristics: productCharacteristicsArray,
      },
    };
    res.status(200).json({
      status: 'success',
      data,
    });
  });

  deleteProduct = this.handlerFactoryController.deleteOne(ProductDBModel, 'product', 'id_product');

}