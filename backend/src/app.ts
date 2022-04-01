import dotenv from "dotenv";
import Server from "./server";

dotenv.config({
  path: './config.env',
});


const server = new Server();

server.run();
