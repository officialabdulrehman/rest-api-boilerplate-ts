import { Document, Types } from "mongoose";

type ID = Types.ObjectId

export type Populated<M, K extends keyof M> =
Omit<M, K> &
{
    [P in K]: Exclude<M[P], ID[] | ID>
}


export type Select<M, K extends keyof M>
    = Pick<M, K> & Document


