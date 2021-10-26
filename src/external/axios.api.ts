
import { ApiError } from "../errors/apierror";
import {APIBase, APIOps, ApiResponse, ContentType} from "./api.base";
import axios, {AxiosResponse} from "axios";

export class AxiosApi extends APIBase {

    private parseAndThrow(err: any){
        const status = err.response && err.response.status || "400";
        let message = err.response && err.response.data || err.message;
        const headers = err.response && err.response.headers || {};
        const contentType = headers["content-type"] || "";
        if(contentType === ContentType.JSON)
            message = JSON.stringify(message);
        else
            message = String(message);
        throw new ApiError(`(${status}): ${message}`, parseInt(status));
    }

    
    protected async GET(uri: string, ops?: APIOps): Promise<ApiResponse> {
        let result: AxiosResponse<any> = null;
        try{

            result = await axios.get(uri, { headers:  ops.headers });
        }
        catch(err){
            this.parseAndThrow(err);
        }
        const data = await result.data;
        const response = new ApiResponse();
        response.data =  data;
        response.header = result.headers;
        response.status = result.status;

        return response;
        
    }
    protected POST(uri: string, ops?: APIOps): Promise<ApiResponse> {
        throw new Error("Method not implemented.");
    }

}
