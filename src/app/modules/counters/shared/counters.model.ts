import { required } from '@rxweb/reactive-form-validators';

export class CountersModel {
    @required()
    name: string;
}
