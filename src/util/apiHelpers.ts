import { NextFunction, Response, Request, response } from "express";
import { ENVIRONMENT } from "./secrets";
import _ from "lodash";
import { check, validationResult } from "express-validator";
import { ApiError } from "../errors/apierror";
import { IPaginateResult } from "../services/pagination";
import { flattenObj } from "./common";

export type IQuery<T> = Partial<Record<keyof T, any>>

export interface ApiResponse {
  stack: string;
  errors: Array<string>;
  result: any;

}
const injectPagination = (res: Response, result: any) => {
  if (result.pagination && (result.pagination.next === "" || result.pagination.next)) {

    const fullUrl = res.req?.protocol + "://" + res.req?.get("host") + res.req?.originalUrl;
    const nextpage = fullUrl + `?page=${result.pagination.page + 1}&perPage=${result.pagination.perPage}`;
    const prevpage = fullUrl + `?page=${result.pagination.page - 1}&perPage=${result.pagination.perPage}`;
    result.pagination.next = null;
    result.pagination.previous = null;
    if (result.pagination.hasNext) {
      result.pagination.next = nextpage;
    }
    if (result.pagination.hasPrevious) {
      result.pagination.previous = prevpage;
    }
  }
  return result;
};
export const apiOk = async (res: Response, result: any) => {

  result = injectPagination(res, result);
  const response: ApiResponse = {
    result: result,
    errors: [],
    stack: ""
  };
  res.status(200).json(response);
};

export const apiError = async (res: Response, err: string | Array<string> | ApiError | Error, statusCode: number = 400) => {
  let myerr: Error = new Error("Something went wrong");
  let errMessages: Array<string> = [];
  if (err instanceof Array) {
    errMessages = err;

  } else if (typeof err === "string") {
    errMessages.push(err);
  }
  else if (err instanceof ApiError) {
    myerr = err;
    errMessages = err.errors;
    statusCode = err.status;
  }
  else if (err instanceof Error) {
    const msg: string = err.message;
    errMessages.push(msg);
    myerr = err;
  }
  else {
    errMessages.push("Fail to transform thrown error. use string, string[] or Error for throwing errors");
  }

  let stack: string = myerr?.stack;

  if (ENVIRONMENT === "production") {
    stack = "No stack in production";
  }

  const response: ApiResponse = {
    result: null,
    errors: errMessages,
    stack: stack
  };

  res.status(statusCode).json(response);
};


export const errorHandler404 = (req: Request, res: Response, next: NextFunction) => {

  const errMsg: string = `Can't find ${req.url} on this server!`;
  res.status(404);
  next(new Error(errMsg));

};

export const errorUnhandledRejection = (err: any) => {
  console.log(err);
  // process.exit(1);
};


export const errorUncughtException = (err: any) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log("Uncaught EXCEPTION: ", err);
  process.exit(1);

};

export const errorHandlerAll = (err: Error, req: Request, res: Response, next: NextFunction) => {


  let statusCode = res.statusCode;
  if (statusCode === 200) {
    statusCode = 500;
  }

  console.log("Error Handler", err);
  apiError(res, err, statusCode);
};

export const catchAsync = (fn: any) => (...args: any[]) => fn(...args).catch(args[2]);

export const apiValidation = (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errs = errors.array().map(x => x.msg.toString());
    const err = new ApiError(errs);
    res.status(400);
    throw err;
  }
};

export const validateAPI = async (req: Request, res: Response, m: any) => {
  m = flattenObj(m);
  const keys = Object.keys(m);

  let body = req.body as any;
  body = flattenObj(body);
  for (const k of keys) {

    const val = m[k];
    if (val === undefined) {
      await check(k, `${k} is invalid`).optional().run(req);
      continue;
    }
    await check(k, `${k} is invalid`).exists().run(req);
  }

  apiValidation(req, res);
};