import { ServiceCRUD } from "../service.crud";
import { PersonDAOI } from "../../dao/person/personI";
import { userDAO } from "../../dao/person/person";

import { PersonDTO } from "../../datamodels/person/Person.dto";

import { sortObjectKeys } from "../../util/common";

class PersonService extends ServiceCRUD<PersonDTO, PersonDAOI> {



}


export const userService = new PersonService(userDAO);
export default userService;

