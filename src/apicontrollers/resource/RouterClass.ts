
import { Request, Response, NextFunction, Router, RequestHandler } from "express";
import { catchAsync,} from "../../util/apiHelpers";


export class RouterClass{
    protected router = Router()
    
    protected middlewares: Array<RequestHandler> = []
    constructor(middlewares?: Array<RequestHandler>){
        if(!middlewares){
            middlewares= [];
        }

        this.middlewares = middlewares;
    }

    private wrapper(callback: RequestHandler) {

        const wrap = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
            const fun = async () => {
                await callback(req, res, next);
            };
            return await fun();
            
        });

        return wrap;
    }

    public get(path: string, middleware: Array<RequestHandler>, callback: RequestHandler) {
        const wrap = this.wrapper(callback);
        middleware = [...this.middlewares, ...middleware];
        this.router.get(path, ...middleware, wrap);
    }

    public post(path: string, middleware: Array<RequestHandler>, callback: RequestHandler) {
        const wrap = this.wrapper(callback);
        middleware = [...this.middlewares, ...middleware];
        this.router.post(path, ...middleware, wrap);
    }

    public patch(path: string, middleware: Array<RequestHandler>, callback: RequestHandler) {
        const wrap = this.wrapper(callback);
        middleware = [...this.middlewares, ...middleware];
        this.router.patch(path, ...middleware, wrap);
    }

    public delete(path: string, middleware: Array<RequestHandler>, callback: RequestHandler) {
        const wrap = this.wrapper(callback);
        middleware = [...this.middlewares, ...middleware];
        this.router.delete(path, ...middleware, wrap);
    }

    public put(path: string, middleware: Array<RequestHandler>, callback: RequestHandler) {
        const wrap = this.wrapper(callback);
        middleware = [...this.middlewares, ...middleware];
        this.router.put(path, ...middleware, wrap);
    }

    public head(path: string, middleware: Array<RequestHandler>, callback: RequestHandler) {
        const wrap = this.wrapper(callback);
        middleware = [...this.middlewares, ...middleware];
        this.router.head(path, ...middleware, wrap);
    }

    public Router() {
        return this.router;
    }

}


