import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';

import AppError from './utils/app-error';
import Database from './database/db.config';
import GlobalErrorHandler from './controllers/errors/global-error-handler.controller';

import authRouter from './routes/auth/authRouter';
import departmentRouter from './routes/department/departmentRouter';
import denounceRouter from './routes/extras/denounceRouter';
import productRequestRouter from './routes/extras/productRequestRouter';
import themeRouter from './routes/extras/themeRouter';
import productRouter from './routes/product/productRouter';
import storeRouter from './routes/store/storeRouter';
import userRouter from './routes/user/userRouter';

class Server {

  private app: Application;
  private port: string;
  private dbConnection: Database;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || '3000';
    this.dbConnection = new Database();

    console.clear();
    console.log('\n\n=====================================================================');
    console.log('======================== PRICE-TRACKER SERVER =======================');
    console.log('=====================================================================');


    this.handleRareEvents();
    this.startMiddlewares(); // enables middlewares for requests
    this.createRoutes(); // enable API routes
    this.handleErrors(); // enable error handling
  }

  private handleRareEvents() {
    process.on('uncaughtException', (err) => {
      console.log(err.name, err.message, err);
      process.exit(1); // code 1 is for unhandled rejection, 0 means success
    });

    process.on('unhandledRejection', (err) => {
      console.error(err);
      process.exit(1); // code 1 is for unhandled rejection, 0 means success
    });
  }

  private handleErrors() {
    const globalErrorHandler = new GlobalErrorHandler();
    this.app.use(globalErrorHandler.handleErrors);
  }

  async run(): Promise<void> {
    try {
      await this.startDBConnection(); // enables DB connection
      this.app.listen(this.port, () => {
        console.log(`[!] Server running on port ${this.port}.\n`);
        console.log('=====================================================================\n');
      });
    } catch (error) {
      console.error(error);
      process.exit(1); // code 1 is for unhandled rejection, 0 means success
    }

  }

  private async startDBConnection(): Promise<void> {
    await this.dbConnection.initialize();
  }

  private startMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.use(express.static(__dirname, { dotfiles: 'allow' }));

    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    this.app.use(helmet()); // security http, this already includes kind of protection against xss
    this.app.use(express.json({ limit: '10kb' })); // limit json size
    this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // prevent parameter polution
    this.app.use(
      hpp({
        whitelist: ['department', 'limit', 'offset'],
      })
    );

    this.app.use(compression()); // reduce data of queries

    this.app.use((req: any, res, next) => {
      req.requestTime = new Date().toISOString();
      next();
    });
  }

  private createRoutes(): void {
    // Routes
    this.app.use('/modular/api/v1/oauth', authRouter);
    this.app.use('/modular/api/v1/theme', themeRouter);
    this.app.use('/modular/api/v1/denounce', denounceRouter);
    this.app.use('/modular/api/v1/product', productRouter);
    this.app.use('/modular/api/v1/product_request', productRequestRouter);
    this.app.use('/modular/api/v1/store', storeRouter);
    this.app.use('/modular/api/v1/department', departmentRouter);
    this.app.use('/modular/api/v1/user', userRouter);
    this.app.use('/modular/api/v1/status', (req, res) => {
      res.status(200).json({
        status: 'success',
        message: 'Server is running',
      });
    });

    // Not found route at all
    this.app.all('*', (req, res, next) => {
      next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
    });

  }

}

export default Server;
