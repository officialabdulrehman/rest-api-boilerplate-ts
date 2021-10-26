import { apiError, errorHandler404, errorUnhandledRejection, errorUncughtException, errorHandlerAll } from "./util/apiHelpers";

process.on("uncaughtException", errorUncughtException);

import express, { Request, Response, NextFunction } from "express";
import compression from "compression";  // compresses requests
import lusca from "lusca";
import cors from "cors";

import { MONGODB_URI } from "./util/secrets";

import { DBConnect } from "./config/database/connection";

const app = express();

DBConnect(MONGODB_URI);

import { testRouter } from "./apicontrollers/test/test";
import { userRouter } from "./apicontrollers/person/person";


app.use(cors());
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(express.json());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use("/api/v1/test", testRouter.Router());
app.use("/api/v1/user", userRouter.Router());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send(`
    <body style="color:#03a9f4;background-color:#222;display:flex;align-items:center;justify-content:center" >
      <h1>Welcome to the dark side</h1>
    </body>
  `);
});
app.all("*", errorHandler404);

app.use(errorHandlerAll);

process.on("unhandledRejection", errorUnhandledRejection);

export default app;
