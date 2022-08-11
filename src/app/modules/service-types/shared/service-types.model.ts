import { required } from "@rxweb/reactive-form-validators";

export class ServiceTypesModel{
    @required()
    code: string;

    @required()
    name: string;
}
