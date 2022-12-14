import { prop, propObject, required } from '@rxweb/reactive-form-validators';

export class ServiceTypesModel {
    @required()
    id: number;

    @prop()
    name: string;
}

export class ServicesModel {
    @required()
    code: string;

    @required()
    laName: string;

    @prop()
    enName: string;

    @propObject()
    type: ServiceTypesModel;
}
