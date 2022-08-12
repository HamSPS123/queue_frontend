import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ServicesFormComponent } from './../services-form/services-form.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Services, ServiceTypes } from '../shared/services.interface';
import { Store, select } from '@ngrx/store';
import { BreadcrumbService } from 'src/app/shared/services/app.breadcrumb.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ServicesService } from '../shared/services.service';

@Component({
    selector: 'app-services-list',
    templateUrl: './services-list.component.html',
})
export class ServicesListComponent implements OnInit {
    @ViewChild(ServicesFormComponent) child: ServicesFormComponent;
    services: Services[];
    spinner$: Observable<boolean>;

    selectedServices: Services[];

    serviceTypes: ServiceTypes[];

    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private servicesService: ServicesService,
        private breadcrumbService: BreadcrumbService,
        private store: Store<any>,
        private confirmService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.breadcrumbService.setItems([{ label: 'ຈັດການຂໍ້ມູນບໍລິການ' }]);
    }

    ngOnInit(): void {
        this.getServices();
        this.spinner$ = this.store.pipe(select((state) => state.spinner.isOn));
    }

    getServices(): void {
        this.servicesService.findAll().subscribe();
        this.servicesService.services$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((services: Services[]) => {
                this.services = services;
            });
    }

    onCreate() {
        this.child.submitted = false;
        this.child.dialogTitle = 'ເພີ່ມຂໍ້ມູນ';
        this.child.showingDialog = true;
    }

    onUpdate(item: Services) {
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
                this.servicesService.removeOne(id).subscribe();
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
                this.servicesService
                    .deleteSelected(this.selectedServices)
                    .subscribe();
            },
        });
    }
}
