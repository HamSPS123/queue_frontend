import { ConfirmationService, MessageService } from 'primeng/api';
import { select, Store } from '@ngrx/store';
import { BreadcrumbService } from './../../../shared/services/app.breadcrumb.service';
import { CountersService } from './../shared/counters.service';
import { Observable, Subject } from 'rxjs';
import { Counters } from './../shared/counters.interfaces';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CountersFormComponent } from '../counter-form/counters-form.component';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-counter-list',
    templateUrl: './counters-list.component.html',
})
export class CountersListComponent implements OnInit {
    @ViewChild(CountersFormComponent) child: CountersFormComponent;
    counters: Counters[];
    spinner$: Observable<boolean>;

    selectedCounters: Counters[];

    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private countersService: CountersService,
        private breadcrumbService: BreadcrumbService,
        private store: Store<any>,
        private confirmService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.breadcrumbService.setItems([{ label: 'ຈັດການຂໍ້ມູນເຄົາເຕີ' }]);
    }

    ngOnInit(): void {
        this.getCounters();
        this.spinner$ = this.store.pipe(select((state) => state.spinner.isOn));
    }

    getCounters(): void {
        this.countersService.findAll().subscribe();
        this.countersService.counters$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((counters: Counters[]) => {
                this.counters = counters;
            });
    }

    onCreate() {
        this.child.submitted = false;
        this.child.dialogTitle = 'ເພີ່ມຂໍ້ມູນ';
        this.child.showingDialog = true;
    }

    onUpdate(item: Counters) {
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
                this.countersService.removeOne(id).subscribe();
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
                this.countersService
                    .deleteSelected(this.selectedCounters)
                    .subscribe();
            },
        });
    }
}
