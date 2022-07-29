import {
    required,
    numeric,
    NumericValueType,
    minLength,
    maxLength,
    prop,
    email,
} from '@rxweb/reactive-form-validators';
export class LoginModel {
    @required()
    code: string;

    @required()
    @minLength({ value: 6 })
    password: string;
}
