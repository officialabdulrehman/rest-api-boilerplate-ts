import {IPaginateResult} from "../dao/pagination";
import {IQuery} from "../dao/query";
import {DTO, DTOCreate, DTOPatch} from "../datamodels/dto";

import {Service} from "./service";
import { DAOI } from "../dao/daoI";
import {CRUDI} from "./crudI";


export class ServiceCRUD <T extends DTO, A extends DAOI<T>> extends Service<T, A> implements CRUDI<T>  {
    async find(cond: IQuery<T>, page: number, perPage: number): Promise<IPaginateResult<T>> {
        const result = await this.getDataAccess().find(cond, page, perPage);
        return result;
    }
    
    async create(data: DTOCreate<T>): Promise<string> {
        const result = await this.getDataAccess().create(data);
        return result;
        
    }
    
    async findById(Id: string): Promise<T> {
        const result = await this.getDataAccess().findById(Id);
        return result;
    }
    
    async update(Id: string, record: DTOPatch<T>):  Promise<T> {
        const result = await this.getDataAccess().update(Id, record);
        return result;
    }

    async delete(Id: string): Promise<string>{
        const result = await this.getDataAccess().delete(Id);
        return result;
    }

}