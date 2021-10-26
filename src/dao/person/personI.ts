import { DAOI } from "../daoI";
import { PersonDTO } from "../../datamodels/person/Person.dto";
import { IPaginateResult } from "../pagination";

export interface PersonDAOI extends DAOI<PersonDTO> {
  findByEmail(email: string): Promise<PersonDTO>;
  partialSearchByEmail(username: string, page: number, perPage: number): Promise<IPaginateResult<PersonDTO>>;
}
