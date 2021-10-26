import {DAOI} from "./daoI";
import { IPaginateResult } from "./pagination";
import { DBSort } from "./sorting";
import {IQuery} from "./query";

import {DTO, DTOCreate} from "../datamodels/dto";

import {genRandomHex, extractFields, checkParams, checkParamDeep} from "../util/common";


export class MemoryDAO<T extends DTO> implements DAOI<T>{
    raw: Array<DTOCreate<T>> = []
    data: Array<T>  = []
    maxDelay: number = 20
    minDelay: number = 10
    maxData: number = 1000

    datamodel: T = null

    constructor(data: Array<DTOCreate<T>>, datamodel: T, maxDelay: number = 20, maxData: number = 1000, minDelay: number = 10){
        
        if (data.length === 0){
            throw new Error("data provided to memory dao is empty");
        }

        this.raw = data;
        this.maxDelay = maxDelay;
        this.maxData = maxData;
        this.minDelay = minDelay;
        this.datamodel = datamodel;

        this.generateData();
    }

    private createDTO(){
        const constructor = this.datamodel.constructor as any;
        const o: T = new constructor();
        return o;
    }

    async fakeDelay(result: Array<T>): Promise<Array<T>> {
        const randomDelay = Math.max(this.minDelay, Math.floor(Math.random() * this.maxDelay));
        const promise = new Promise<Array<T>>((res, rej) => {
            setTimeout(() => res(result), randomDelay);
        });

        return promise;
    }


    generateData() {

        
        const raw = this.raw.slice(0, this.maxData);
        const result = raw.map((item: any) => {
            item.id = genRandomHex(16);
            const o = this.createDTO();
            const obj: T = extractFields(o, item);
            return obj;
        });
        
        this.data = result;
        return this.data;
    }


    async getData(): Promise<Array<T>> {
        
        const result = await this.fakeDelay(this.data);
        return result;
    }


    async find_(cond: IQuery<T>, page: number, perPage: number, filterCallback?: any): Promise<IPaginateResult<T>> {
        
        if (page <= 0) {
            throw new Error("Page cannot be less than 1");
        }

        if (perPage <= 0) {
            throw new Error("perPage cannot be less than 1");
        }

        if (!filterCallback) {
            filterCallback = checkParams;
        }

        const start = (page - 1) * perPage;
        const end = start + perPage;

        const data = await this.getData();
        let result = data.filter((item) => filterCallback(cond, item));

        result = result.slice(start, end);
        

        const hasNext = result.length > this.data.length;
        const hasPrevious = result.length > 0  && page > 1;

        const paginatedResult: IPaginateResult<T> = {
            data: result,
            pagination: {
                page: page, 
                perPage: perPage,
                hasNext: hasNext,
                hasPrevious: hasPrevious,
                next: "",
                previous: ""
            }
        };

        return paginatedResult;

    }

    async find(cond: IQuery<T>, page: number = 1, perPage: number=10): Promise<IPaginateResult<T>> {
        const result = await this.find_(cond, page, perPage);
        return result;
    }

    async create(data: DTOCreate<T>): Promise<string> {
        const obj = this.createDTO();
        const o = extractFields(obj, data);
        o.id = genRandomHex(16); 
        const res = await this.fakeDelay([o]);
        const result = res[0];
        this.data.push(result);
        return result.id;
    }

    async findById(Id: string, populate?: string[]): Promise<T> {
        const data = await this.getData();
        const res = data.filter((item) => {
            return item.id === Id;
        });

        if (res.length === 0) {
            throw new Error(`item with id ${Id} not found`);
        }

        const result = res[0];

        return result;

    }


    async update(Id: string, record: Partial<DTOCreate<T>>): Promise<T> {
        const result = await this.findById(Id);
        extractFields(result, record);
        return result;
    }

    async delete(Id: string): Promise<string> {
        const res = await this.findById(Id);
        this.data = this.data.filter((item)=>item.id!= Id);
        return res.id;
    }


    async search(cond: IQuery<T>, page = 1, perPage = 100) {

        const result = await this.find_(cond, page, perPage, checkParamDeep);
        return result;
    }


}