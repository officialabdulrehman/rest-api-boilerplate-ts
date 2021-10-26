import { IPaginateResult } from "./pagination";
import { model, Schema, Document, Types, Model } from "mongoose";
import { DBSort } from "./sorting";

import { DAOI } from "./daoI";
import { DTO, DTOCreate, DTOPatch } from "../datamodels/dto";

import { extractFields, flattenObj } from "../util/common";


type TDoc<T extends DTO> = Document & DTOCreate<T>
type ModelType<T extends DTO> = Model<TDoc<T>>


const ID = Types.ObjectId;

export class MongoDAO<TData extends DTO> implements DAOI<TData>{
  protected model: ModelType<TData>
  protected dto: TData = null
  constructor(model: ModelType<TData>, dto: TData) {
    this.model = model;
    this.dto = dto;
  }

  private createDTO(): TData {
    const constructor = this.dto.constructor as any;
    const obj: TData = new constructor();
    return obj;
  }

  public async find(cond: any, page: number = 1, perPage: number = 10, populate: string[] = [],
    sort: Record<string, DBSort> = { "createdAt": DBSort.DESCENDING }): Promise<IPaginateResult<TData>> {
    if (page < 1) {
      throw Error("Page cannot be smaller than 1");
    }
    if (perPage < 1) {
      throw new Error("perPage cannot be smaller than 1");
    }

    let skip = (page - 1) * perPage;
    skip = page > 1 ? skip - 1 : skip;
    const limit = page > 1 ? perPage + 2 : perPage + 1;  // get one extra result for checking more records

    let query = this.model.find(cond);
    for (const p of populate) {
      query = query.populate(p);
    }
    query = query.skip(skip).limit(limit).sort(sort);
    let data = await query;

    const userCount = data.length;
    const hasPrevious = page > 1 && userCount > 0;
    const lower = hasPrevious ? 1 : 0;

    const hasNext = userCount > perPage + lower;
    const upper = hasNext ? perPage + lower : userCount;

    data = data.slice(lower, upper);

    const res = data.map((item) => extractFields(this.createDTO(), item));


    const result: IPaginateResult<TData> = {
      data: res,
      pagination: {
        hasNext: hasNext,
        hasPrevious: hasPrevious,
        perPage: perPage,
        page: page,
        next: "",
        previous: ""
      }
    };

    return result;

  }

  public async findById(Id: string, populate: string[] = []): Promise<TData> {
    const id = new ID(Id);
    const result = await this.find({ "_id": id }, 1, 10, populate);
    if (result.data.length == 0) {
      throw new Error(`record with id ${id} not found`);
    }

    const user = result.data[0];
    return user;
  }

  public async update(Id: string, record: DTOPatch<TData>): Promise<TData> {
    const existing = await this.model.findById(Id);

    let myrecord = record as any;
    myrecord = flattenObj(myrecord);

    const keys = Object.keys(myrecord);
    for (const k of keys) {
      existing.set(k, myrecord[k]);
    }

    const result = await existing.save();

    let obj = this.createDTO();
    obj = extractFields(obj, result);
    return obj;
  }

  public async create(record: DTOCreate<TData>): Promise<string> {
    const obj = new this.model();
    let myrecord = record as any;
    myrecord = flattenObj(myrecord);
    const keys = Object.keys(myrecord);

    for (const k of keys) {
      obj.set(k, myrecord[k]);
    }


    const result = await obj.save();
    const id = String(result._id);
    return id;
  }

  public async delete(Id: string): Promise<string> {
    const existing = await this.model.findById(Id);
    const result = await existing.remove();

    return Id;
  }


  public async findByIdAndUpdate(id: string, record: any): Promise<TData> {
    const result = await this.model.findByIdAndUpdate(id, record, { new: true });
    let obj = this.createDTO();
    obj = extractFields(obj, result);
    return obj;
  }

}
