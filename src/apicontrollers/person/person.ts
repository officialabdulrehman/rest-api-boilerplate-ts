import { Request, Response, NextFunction } from "express";
import { check, sanitize, oneOf } from "express-validator";

import { apiError, catchAsync, apiValidation, apiOk, IQuery } from "../../util/apiHelpers";
import { RouterClass } from "../resource/RouterClass";

import { ResourceRouter } from "../resource/ResourceRouter";

import { userService } from "../../services/person/person";
import { PersonDTO } from "../../datamodels/person/Person.dto";

import _ from "lodash";

class PersonRouter extends ResourceRouter<PersonDTO> {

}

export const userRouter = new PersonRouter(new PersonDTO(), userService);
export default userRouter;
