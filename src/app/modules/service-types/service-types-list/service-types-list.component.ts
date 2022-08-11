import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { BreadcrumbService } from 'src/app/shared/services/app.breadcrumb.service';
import { ServiceTypes } from '../shared/service-types.interface';
import { ServiceTypesService } from '../shared/service-types.service';
import { takeUntil } from 'rxjs/operators';
import { ServiceTypesFormComponent } from '../service-types-form/service-types-form.component';

@Component({
    selector: 'app-service-types-list',
    templateUrl: './service-types-list.component.html',
})
export class ServiceTypesListComponent implements OnInit {
    @ViewChild(ServiceTypesFormComponent) child: ServiceTypesFormComponent;
    serviceTypes: ServiceTypes[];
    spinner$: Observable<boolean>;

    selectedTypes: ServiceTypes[];

    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private serviceTypesService: ServiceTypesService,
        private breadcrumbService: BreadcrumbService,
        private store: Store<any>,
        private confirmService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.breadcrumbService.setItems([
            { label: 'ຈັດການຂໍ້ມູນປະເພດບໍລິການ' },
        ]);
    }

    ngOnInit(): void {
        this.getServiceTypes();
        this.spinner$ = this.store.pipe(select((state) => state.spinner.isOn));
    }

    getServiceTypes(): void {
        this.serviceTypesService.findAll().subscribe();
        this.serviceTypesService.serviceTypes$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((serviceTypes: ServiceTypes[]) => {
                this.serviceTypes = serviceTypes;
            });
    }

    onCreate() {
        this.child.submitted = false;
        this.child.dialogTitle = 'ເພີ່ມຂໍ້ມູນ';
        this.child.showingDialog = true;
    }

    onUpdate(item: ServiceTypes) {
        this.child.item = { ...item };
        this.child.dialogTitle = 'ແກ້ໄຂຂໍ້ມູນ';

        Object.entries(item).forEach(([key, value]: any) => {
            const form = this.child.formGroup;

            if (form.controls.hasOwnProperty(key)) {
                form.patchValue({
                    [key]: value,
                });
            }

            this.child.showingDialog = true;
        });
    }

    onDelete(event: Event, id: number) {
        this.confirmService.confirm({
            target: event.target,
            message: 'ຕ້ອງການລົບຜູ້ໃຊ້ນີ້ ຫຼື ບໍ່?',
            icon: 'pi pi-exclamation-triangle',
            key: 'popup',
            acceptLabel: 'ຕົກລົງ',
            rejectLabel: 'ຍົກເລີກ',
            accept: () => {
                this.serviceTypesService.removeOne(id).subscribe();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'ປະຕິເສດ',
                });
            },
        });
    }

    onDeleteSelected() {
        this.confirmService.confirm({
            message: 'ເຈົ້າຕ້ອງການຈະລົບຜູ້ໃຊ້ເຫຼົ່ານີ້ ຫຼື ບໍ່?',
            header: 'ຢືນຢັນການລົບ',
            key: 'confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.serviceTypesService.deleteSelected(this.selectedTypes).subscribe();
            },
        });
    }
}
