import { minLength, prop, propObject, required, unique } from '@rxweb/reactive-form-validators';

export class UserModel {
    @required()
    code: string;

    @required()
    firstName: string;

    @required()
    lastName: string;

    @propObject()
    role: RoleModel;
}

export class RoleModel{
    @prop()
    id: number;

    @prop()
    roleName: string;
}
