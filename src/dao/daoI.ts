import {DBSort} from "./sorting";
import {IPaginateResult} from "./pagination";
import {IQuery} from "./query";
import {DTO, DTOCreate, DTOPatch} from "../datamodels/dto";


export interface DAOI <T extends DTO>  {
    find(cond: IQuery<T>, page: number, perPage: number, populates?: string[], 
        sort?: Record<string, DBSort>): Promise<IPaginateResult<T>>;
    
    create(data: DTOCreate<T>): Promise<string>; 
    
    findById(Id: string, populate?: string[]): Promise<T>;
    
    update(Id: string, record: DTOPatch<T>):  Promise<T>;

    delete(Id: string): Promise<string>;

}