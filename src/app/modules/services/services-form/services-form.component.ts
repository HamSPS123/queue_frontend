import { ServiceTypesService } from './../../service-types/shared/service-types.service';
import { ServicesModel, ServiceTypesModel } from './../shared/services.model';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from './../../../shared/services/utils.service';
import { DialogService } from './../../../shared/services/dialog.service';
import {
    RxFormBuilder,
    ReactiveFormConfig,
    RxFormGroup,
} from '@rxweb/reactive-form-validators';
import { Store, select } from '@ngrx/store';
import { Services, Type } from './../shared/services.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ServicesService } from '../shared/services.service';

@Component({
    selector: 'app-services-form',
    templateUrl: './services-form.component.html',
})
export class ServicesFormComponent implements OnInit {
    showingDialog: boolean;
    dialogTitle: string = '';
    submitted: boolean;
    formGroup: RxFormGroup;

    item: Services;

    serviceId: string;

    spinner$: Observable<boolean>;
    serviceTypes$: Observable<Type[]>;

    private unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private store: Store<any>,
        private fb: RxFormBuilder,
        private dialogService: DialogService,
        private utilsService: UtilsService,
        private route: ActivatedRoute,
        private servicesService: ServicesService,
        private ServiceTypesService: ServiceTypesService,
        private messageService: MessageService
    ) {
        ReactiveFormConfig.set(this.utilsService.validationMessages);
    }

    get f() {
        return this.formGroup.controls;
    }

    ngOnInit(): void {
        this.serviceId = this.route.snapshot.paramMap.get('id');

        this.initForm();
        this.spinner$ = this.store.pipe(select((state) => state.spinner.isOn));
        this.dialogService.dialog$.subscribe(
            (value) => (this.showingDialog = value)
        );
    }

    onShowDialog() {
        this.getServiceTypes();
    }

    getServiceTypes(): void {
        this.ServiceTypesService.findAll().subscribe();
        this.serviceTypes$ = this.ServiceTypesService.serviceTypes$;
    }

    onHideDialog() {
        this.showingDialog = false;
        this.submitted = false;
        this.formGroup.reset();
        this.formGroup.enable();
        this.formGroup.get('code').clearValidators();
        this.formGroup.get('laName').clearValidators();
        this.formGroup.get('type.id').clearValidators();
        this.formGroup.updateValueAndValidity;
    }

    initForm() {
        const model = new ServicesModel();
        model.type = new ServiceTypesModel();
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
            this.servicesService.update(+id, formData).subscribe();
        } else {
            this.servicesService.create(formData).subscribe();
        }
    }
}
