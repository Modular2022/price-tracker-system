import express, { Application, Request, Response, Router } from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';

class Server {

  private app: Application;
  private port: string;

  constructor() {
    this.handleRareEvents();
    this.app = express();
    this.port = process.env.PORT || '3000';

    console.clear();
    console.log('\n\n=====================================================================');
    console.log('======================== PRICE-TRACKER SERVER =======================');
    console.log('=====================================================================');


    this.middlewares(); // enables middlewares for requests
    this.dbConnection(); // enables DB connection
    this.routes(); // enable API routes
  }

  handleRareEvents() {
    process.on('uncaughtException', (err) => {
      console.log(err.name, err.message, err);
      process.exit(1); // code 1 is for unhandled rejection, 0 means success
    });
  }

  listen(): void {
    this.app.listen(this.port, () => {
      console.log(`[!] Server running on port ${this.port}.\n`);
      console.log('=====================================================================\n');
    });
  }

  dbConnection(): void { }

  middlewares(): void {
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

  routes(): void {
    const router = Router();
    this.app.use('/api/v1/test', router.get('/', (req, res) => {
      res.json({
        ok: true,
        msg: 'Hello, world!'
      });
    }));

  }

}

export default Server;
