
import { Request, Response, NextFunction, Router, RequestHandler } from "express";
import { check, sanitize, oneOf } from "express-validator";

import { apiError, catchAsync, apiValidation, apiOk, IQuery } from "../../util/apiHelpers";
// import { GetIdentity } from "../../config//auth/auth";
import { mongoID } from "../../util/apiValidation";
import { flattenObj, isPlainObj } from "../../util/common";


import { DatabaseService } from "../../services/database";
import { Document } from "mongoose";

import { RouterClass } from "./RouterClass";
import { ServiceCRUD } from "../../services/service.crud";

import { DTO } from "../../datamodels/dto";
import { DAOI } from "../../dao/daoI";


export type RRService<T extends DTO> = ServiceCRUD<T, DAOI<T>>

export type Callback = (request: Request, response: Response) => Promise<any>

export class ResourceRouter<IModel extends DTO> extends RouterClass {
    m: IModel
    service: RRService<IModel>
    // router = Router()

    constructor(m: IModel, service: RRService<IModel>, middlewares?: Array<RequestHandler>) {
        super(middlewares);
        this.m = m;
        delete m.id;
        this.service = service;
        this.init();
    }


    private async validate(req: Request) {
        let m = this.m as any;

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
    }

    private async resourceGet(req: Request, res: Response) {

        await check("page", "page must be an integer greater than 0").optional().isInt({ gt: 0 }).run(req);
        await check("perPage", "perPage must be an integer greater than 0").optional().isInt({ gt: 0 }).run(req);
        apiValidation(req, res);
        let page = req.query.page || 1;
        let perPage = req.query.perPage || 10;
        page = parseInt(page as string);
        perPage = parseInt(perPage as string);

        delete req.query.page;
        delete req.query.perPage;
        const query: IQuery<IModel> = req.query as any || {};
        const result = await this.service.find(query, page, perPage);
        apiOk(res, result);

    }

    private async resourceGetId(req: Request, res: Response) {
        await check("id", "id is required").exists().customSanitizer(mongoID).run(req);
        apiValidation(req, res);
        const Id = String(req.params.id);
        const result = await this.service.findById(Id);
        apiOk(res, result);
    }

    private async resourceCreate(req: Request, res: Response) {
        await this.validate(req);
        apiValidation(req, res);

        const data: IModel = req.body;
        const result = await this.service.create(data);
        apiOk(res, result);
    }

    private async resourceUpdate(req: Request, res: Response) {
        await check("id", "id is required").exists().customSanitizer(mongoID).run(req);
        apiValidation(req, res);

        const Id: string = String(req.params.id);
        const updates: Partial<IModel> = req.body;
        const result = await this.service.update(Id, updates);
        apiOk(res, result);
    }

    private async resourceDelete(req: Request, res: Response) {
        await check("id", "id is required").exists().customSanitizer(mongoID).run(req);
        apiValidation(req, res);

        const Id: string = String(req.params.id);
        const result = await this.service.delete(Id);
        apiOk(res, result);
    }

    protected GET(path: string, middleware: Array<RequestHandler>, callback: Callback) {

        this.get(path, middleware, catchAsync(async (req: Request, res: Response, next: NextFunction) => {

            await callback(req, res);

        }));
    }

    protected GETID(path: string, middleware: Array<RequestHandler>, callback: Callback) {

        this.get(path, middleware, catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            // await this.resourceGetId(req, res);
            await callback(req, res);
        }));
    }

    protected POST(path: string, middleware: Array<RequestHandler>, callback: Callback) {

        this.post(path, middleware, catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            // await this.resourceCreate(req, res);
            await callback(req, res);
        }));
    }

    protected PATCH(path: string, middleware: Array<RequestHandler>, callback: Callback) {

        this.patch(path, middleware, catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            // await this.resourceUpdate(req, res);
            await callback(req, res);
        }));
    }

    protected DELETE(path: string, middleware: Array<RequestHandler>, callback: Callback) {

        this.delete(path, middleware, catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            // await this.resourceDelete(req, res);
            await callback(req, res);
        }));
    }

    private init() {

        this.GET("/", [], (req, res) => this.resourceGet(req, res));
        this.GETID("/:id", [], (req, res) => this.resourceGetId(req, res));
        this.POST("/", [], (req, res) => this.resourceCreate(req, res));
        this.PATCH("/:id", [], (req, res) => this.resourceUpdate(req, res));
        this.DELETE("/:id", [], (req, res) => this.resourceDelete(req, res));

    }

}