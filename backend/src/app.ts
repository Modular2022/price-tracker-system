import dotenv from "dotenv";
import Server from "./server";

dotenv.config({
  path: __dirname + '/../config.env',
});

const server = new Server();

server.run();
