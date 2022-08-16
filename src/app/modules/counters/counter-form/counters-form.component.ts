import { CountersModel } from './../shared/counters.model';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from './../../../shared/services/utils.service';
import { DialogService } from './../../../shared/services/dialog.service';
import { Observable, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
    RxFormGroup,
    RxFormBuilder,
    ReactiveFormConfig,
} from '@rxweb/reactive-form-validators';
import { Counters } from '../shared/counters.interfaces';
import { Store, select } from '@ngrx/store';
import { CountersService } from '../shared/counters.service';

@Component({
    selector: 'app-counter-form',
    templateUrl: './counters-form.component.html',
})
export class CountersFormComponent implements OnInit {
    showingDialog: boolean;
    dialogTitle: string = '';
    submitted: boolean;
    formGroup: RxFormGroup;

    item: Counters;

    counterId: string;

    spinner$: Observable<boolean>;

    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private store: Store<any>,
        private fb: RxFormBuilder,
        private dialogService: DialogService,
        private utilsService: UtilsService,
        private route: ActivatedRoute,
        private countersService: CountersService,
        private messageService: MessageService
    ) {
        ReactiveFormConfig.set(this.utilsService.validationMessages);
    }

    get f() {
        return this.formGroup.controls;
    }

    ngOnInit(): void {
        this.counterId = this.route.snapshot.paramMap.get('id');

        this.initForm();
        this.spinner$ = this.store.pipe(select((state) => state.spinner.isOn));
        this.dialogService.dialog$.subscribe(
            (value) => (this.showingDialog = value)
        );
    }

    onShowDialog() {}

    onHideDialog() {
        this.showingDialog = false;
        this.submitted = false;
        this.formGroup.reset();
        this.formGroup.enable();
        this.formGroup.get('name').clearValidators();
        this.formGroup.updateValueAndValidity;
        this.item = {};
    }

    initForm() {
        const model = new CountersModel();
        this.formGroup = <RxFormGroup>this.fb.formGroup(model);
    }

    onSave() {
        this.submitted = true;

        if (this.formGroup.invalid) {
            return;
        }

        const id = this.item?.id;
        const formData = this.formGroup.value;

        console.log(formData);

        if (id) {
            this.countersService.update(+id, formData).subscribe();
        } else {
            this.countersService.create(formData).subscribe();
        }
    }
}
