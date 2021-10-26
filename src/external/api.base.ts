import { ApiError } from "../errors/apierror";

export enum ApiMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH"

}

export enum ContentType {
  JSON = "application/json",
  FORM_URL_ENCODED = "application/x-www-form-urlencoded"
}

export enum Accept {
  JSON = "application/json"
}

export class ApiResponse {
  status: number = null
  header: Record<string, any> = null
  data: any = null
  responseType: string = null
}


export class APIOps {
  authorization?: string = ""
  headers?: Record<string, any> = {}
  params?: Record<string, any> = {}
  body?: any = {}

}

export abstract class APIBase {

  private createHeader(headers?: any, authorization?: string) {

    let _headers = {
      "Accept": Accept.JSON,
    };


    if (authorization && authorization !== "") {
      const auth = {
        "Authorization": authorization
      };

      _headers = { ..._headers, ...auth };

    }

    if (headers) {
      _headers = { ..._headers, ...headers, };

    }

    return _headers;

  }

  private createUrlParam(uri: string, params?: any) {
    if (params && Object.keys(params).length > 0) {
      const urlParam = new URLSearchParams(params);
      uri = `${uri}?${urlParam.toString()}`;
    }

    return uri;
  }

  protected abstract GET(uri: string, ops?: APIOps): Promise<ApiResponse>

  protected abstract POST(uri: string, ops?: APIOps): Promise<ApiResponse>


  public async get(uri: string, ops?: APIOps): Promise<ApiResponse> {
    if (!ops) {
      ops = new APIOps();
    }

    let myops = new APIOps();
    myops = { ...myops, ...ops };

    const headers = this.createHeader(myops.headers, myops.authorization);
    const params = this.createUrlParam(uri, myops.params);

    myops.headers = headers;

    uri = this.createUrlParam(uri, myops.params);

    const result = await this.GET(uri, myops);
    return result;
  }
}
