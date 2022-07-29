import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private dialog = new BehaviorSubject<boolean>(false);
    readonly dialog$ = this.dialog.asObservable();
    constructor() {}

    showDialog(value: boolean) {
        this.dialog.next(value);
    }
}
