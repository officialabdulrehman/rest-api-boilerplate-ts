import { MongoDAO } from "../MongoDAO";
import { PersonDTO } from "../../datamodels/person/Person.dto";
import { PersonModel } from "../../models/person/person";

import { PersonDAOI } from "./personI";
import { query } from "express";
import { IPaginateResult } from "../pagination";

export class PersonDAO extends MongoDAO<PersonDTO> implements PersonDAOI {

  public async findByEmail(email: string): Promise<PersonDTO> {
    const result = await this.find({ email });
    if (result.data.length == 0)
      throw new Error("record not found");
    return result.data[0];
  }

  public async partialSearchByEmail(username: string, page: number, perPage: number): Promise<IPaginateResult<PersonDTO>> {
    const partialText = new RegExp(username, "i");
    const result = await this.find({ "username": partialText }, page, perPage);
    return result;
  }

}

export const userDAO = new PersonDAO(PersonModel, new PersonDTO());

export default userDAO;