
import { DAOI } from "../dao/daoI";
import { DTO } from "../datamodels/dto";


export abstract class Service<DataTransferObject extends DTO, DataAccessobject extends DAOI<DataTransferObject>> {
    dataAccess: DataAccessobject = null
    constructor(dataAccess: DataAccessobject) {

        this.dataAccess = dataAccess;
    }

    protected getDataAccess() {
        return this.dataAccess;
    }
}


