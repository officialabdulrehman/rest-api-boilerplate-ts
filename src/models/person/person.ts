import { model, Schema, Document, Types } from "mongoose";

import { DTOCreate } from "../../datamodels/dto";
import { PersonDTO } from "../../datamodels/person/Person.dto";

type ID = Types.ObjectId


export interface IPersonDoc extends DTOCreate<PersonDTO>, Document { }


const schemaFields: Record<keyof DTOCreate<PersonDTO>, any> = {
  email: { type: String, required: true, unique: true },
  name: { type: String, required: false },
  dateOfBirth: { type: String, required: false },
};


const schema = new Schema(schemaFields, { timestamps: true });

export const PersonModel = model<IPersonDoc>("Person", schema);