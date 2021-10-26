import { IPaginateResult } from "./pagination";
import { model, Schema, Document, Types, Model } from "mongoose";


const ID = Types.ObjectId;
export enum DBSort {
  ASCENDING = 1,
  DESCENDING = -1
}

export class DatabaseService<TData, TDoc extends Document & TData> {
  protected model: Model<TDoc>
  constructor(model: Model<TDoc>) {
    this.model = model;
  }

  public async find(cond: any, page: number = 1, perPage: number = 10, populate: string[] = [],
    sort: Record<string, DBSort> = { "createdAt": DBSort.DESCENDING }): Promise<IPaginateResult<TDoc>> {
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
    let users = await query;

    const userCount = users.length;
    const hasPrevious = page > 1 && userCount > 0;
    const lower = hasPrevious ? 1 : 0;

    const hasNext = userCount > perPage + lower;
    const upper = hasNext ? perPage + lower : userCount;

    users = users.slice(lower, upper);

    const result: IPaginateResult<TDoc> = {
      data: users,
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

  public async findById(Id: string, populate: string[] = []) {
    const id = new ID(Id);
    const result = await this.find({ "_id": id }, 1, 10, populate);
    if (result.data.length == 0) {
      throw new Error(`record with id ${id} not found`);
    }

    const user = result.data[0];
    return user;
  }

  public async update(Id: string, record: Partial<TData>, existing?: TDoc) {
    if (!existing) {
      existing = await this.findById(Id);
    }

    let myrecord = record as any;
    myrecord = this.flattenObj(myrecord);
    const keys = Object.keys(myrecord);
    for (const k of keys) {
      existing.set(k, myrecord[k]);
    }

    const result = await existing.save();
    return result;
  }

  public async create(record: TData) {
    const obj = new this.model();
    let myrecord = record as any;
    myrecord = this.flattenObj(myrecord);
    const keys = Object.keys(myrecord);

    for (const k of keys) {
      obj.set(k, myrecord[k]);
    }


    const result = obj.save();
    return result;

  }

  public async delete(Id: string, existing?: TDoc) {
    if (!existing) {
      existing = await this.findById(Id);
    }
    const result = await existing.remove();
    return result;
  }

  private isPlainObj(o: any) {
    let result = o && o.constructor && o.constructor.prototype && o.constructor.prototype.hasOwnProperty("isPrototypeOf");
    result = Boolean(result);
    return result;
  }

  private flattenObj(obj: any, keys: string[] = []): any {
    return Object.keys(obj).reduce((acc, key) => {
      return Object.assign(acc, this.isPlainObj(obj[key])
        ? this.flattenObj(obj[key], keys.concat(key))
        : { [keys.concat(key).join(".")]: obj[key] }
      );
    }, {});
  }


}