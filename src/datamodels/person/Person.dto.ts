import { DTO } from "../dto";

export class PersonDTO extends DTO {
  email: string = null
  name?: string = undefined
  dateOfBirth?: Date = undefined
}