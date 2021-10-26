import { Request, Response, NextFunction } from "express";
import { check, sanitize, oneOf } from "express-validator";

import { apiError, catchAsync, apiValidation, apiOk, IQuery } from "../../util/apiHelpers";

import { RouterClass } from "../resource/RouterClass";


import _ from "lodash";
import { multerUpload, deleteFile } from "../../util/upload";

class TestRouter extends RouterClass {

}

export const testRouter = new TestRouter();
export default testRouter;
