import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, pipe, Subject } from 'rxjs';
import { BreadcrumbService } from 'src/app/shared/services/app.breadcrumb.service';
import { RolesService } from '../shared/roles.service';
import { Role, User } from '../shared/users.interface';
import { UserFormComponent } from '../user-form/user-form.component';
import { takeUntil } from 'rxjs/operators';
import { UsersService } from '../shared/users.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
    @ViewChild(UserFormComponent) child: UserFormComponent;
    users: User[];
    spinner$: Observable<boolean>;

    selectedUsers: User[];

    roles: Role[];

    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private usersService: UsersService,
        private breadcrumbService: BreadcrumbService,
        private store: Store<any>,
        private confirmService: ConfirmationService,
        private rolesService: RolesService,
        private messageService: MessageService
    ) {
        this.breadcrumbService.setItems([{ label: 'ຈັດການຂໍ້ມູນຜູ້ໃຊ້' }]);
    }

    ngOnInit(): void {
        this.getUsers();
        this.spinner$ = this.store.pipe(select((state) => state.spinner.isOn));
    }

    getUsers(): void {
        this.usersService.findAll().subscribe();
        this.usersService.users$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((users: User[]) => {
                this.users = users;
            });
    }

    onCreate() {
        this.child.submitted = false;
        this.child.dialogTitle = 'ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້';
        this.child.showingDialog = true;
    }

    onUpdate(item: User) {
        this.child.item = { ...item };
        this.child.dialogTitle = 'ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້';

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

    onResetPassword(event: Event, id: number) {
        this.confirmService.confirm({
            target: event.target,
            message: 'ຕ້ອງການປ່ຽນລະຫັດຜ່ານ ຫຼື ບໍ່?',
            icon: 'pi pi-exclamation-triangle',
            key: 'popup',
            acceptLabel: 'ຕົກລົງ',
            rejectLabel: 'ຍົກເລີກ',
            accept: () => {
                this.usersService.defaultPassword(id).subscribe();
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

    onDelete(event: Event, id: number) {
        this.confirmService.confirm({
            target: event.target,
            message: 'ຕ້ອງການລົບຜູ້ໃຊ້ນີ້ ຫຼື ບໍ່?',
            icon: 'pi pi-exclamation-triangle',
            key: 'popup',
            acceptLabel: 'ຕົກລົງ',
            rejectLabel: 'ຍົກເລີກ',
            accept: () => {
                this.usersService.removeOne(id).subscribe();
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
                this.usersService.deleteSelected(this.selectedUsers).subscribe();
            },
        });
    }
}
