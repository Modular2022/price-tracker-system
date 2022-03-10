import "colors";
import dotenv from "dotenv";
import Server from "./models/server";
dotenv.config();

const server = new Server();

setTimeout( () => server.listen(), 1500 );
