import express, { Application, Request, Response, Router } from "express";
import cors from "cors";

class Server {

  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";

    console.clear();
    console.log("\n\n=====================================================================".cyan);
		console.log("======================== PRICE-TRACKER SERVER =======================".magenta);
		console.log("=====================================================================\n".cyan);

    
    this.dbConnection(); // enables DB connection
    this.middlewares(); // enables middlewares for requests
    this.routes(); // enable API routes
  }

  listen(): void {
    this.app.listen( this.port, () => {
      console.log( `[!] Server running on port ${this.port.green}.\n` );
      console.log( "=====================================================================\n".gray );
    } );
  }

  dbConnection(): void {}

  middlewares(): void {
    this.app.use( cors() );
    this.app.use( express.json() );

    // serve public folder
    // this.app.use( express.static( "" ) )
  }

  routes(): void {
    const router = Router();
    this.app.use( "/api", router.get( "/", (req, res) => {
      res.json({
        ok: true,
        msg: "Hello, world!"
      });
    } ) );
    
  }

}

export default Server;
