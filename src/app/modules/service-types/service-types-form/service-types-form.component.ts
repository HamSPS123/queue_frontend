import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ReactiveFormConfig, RxFormBuilder } from '@rxweb/reactive-form-validators';
import { MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ServiceTypes } from '../shared/service-types.interface';
import { ServiceTypesModel } from '../shared/service-types.model';
import { ServiceTypesService } from '../shared/service-types.service';

@Component({
    selector: 'app-service-types-form',
    templateUrl: './service-types-form.component.html',
})
export class ServiceTypesFormComponent implements OnInit {
    showingDialog: boolean;
    dialogTitle: string;
    submitted: boolean;
    formGroup: FormGroup;

    item: ServiceTypes;

    serviceTypeId: string;

    spinner$: Observable<boolean>;

    private unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private store: Store<any>,
        private fb: RxFormBuilder,
        private dialogService: DialogService,
        private utilsService: UtilsService,
        private route: ActivatedRoute,
        private serviceTypesService: ServiceTypesService,
        private messageService: MessageService
    ) {
        ReactiveFormConfig.set(this.utilsService.validationMessages);
    }

    get f() {
        return this.formGroup.controls;
    }

    ngOnInit(): void {
        this.serviceTypeId = this.route.snapshot.paramMap.get('id');

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
    }

    initForm() {
        const model = new ServiceTypesModel();
        this.formGroup = this.fb.formGroup(model);
    }

    onSave() {
        this.submitted = true;

        if (this.formGroup.invalid) {
            return;
        }

        const id = this.item?.id;
        const formData = this.formGroup.value;

        if (id) {
            this.serviceTypesService.update(+id, formData).subscribe();
        } else {
            this.serviceTypesService.create(formData).subscribe();
        }
    }
}
