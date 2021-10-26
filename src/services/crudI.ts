import {IPaginateResult} from "../dao/pagination";
import {IQuery} from "../dao/query";
import {DTO, DTOCreate, DTOPatch} from "../datamodels/dto";


export interface CRUDI<T extends DTO>  {
    find(cond: IQuery<T>, page: number, perPage: number): Promise<IPaginateResult<T>>;
    
    create(data: DTOCreate<T>): Promise<string>;
    
    findById(Id: string, populate?: string[]): Promise<T>;
    
    update(Id: string, record: DTOPatch<T>):  Promise<T>;

    delete(Id: string): Promise<string>;

}