import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  badRequestHandler,
  forbiddenErrorHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js";
import usersRouter from "./api/users/index.js";
import accommodationsRouter from "./api/accommodations/index.js";

const server = express();
const port = process.env.PORT || 3001;

//**********MIDDLEWARES ********************/

server.use(cors());
server.use(express.json());

//**********ENDPOINTS *********************/

server.use("/users", usersRouter);
server.use("/accommodations", accommodationsRouter);

//************ERROR HANDLERS**************/
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(genericErrorHandler);

//***************************************/

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_CONNECTION_URL);

mongoose.connection.on("connected", () => {
  console.log("Successfuly connected to Mongo!");

  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server is running on port:", port);
  });
});
