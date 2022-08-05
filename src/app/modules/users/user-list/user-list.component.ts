import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
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

    @ViewChild(UserFormComponent) child: UserFormComponent
    users: User[];
    spinner$: Observable<boolean>;


    roles: Role[];

    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private usersService: UsersService,
        private breadcrumbService: BreadcrumbService,
        private store: Store<any>,
        private confirmService: ConfirmationService,
        private rolesService: RolesService
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
        this.child.dialogTitle = "ເພີ່ມຂໍ້ມູນຜູ້ໃຊ້";
        this.child.showingDialog = true;
    }

    onUpdate(item: User) {
        this.child.item = {...item};
        this.child.dialogTitle = "ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້";

        Object.entries(item).forEach(([key, value]: any) => {
            const form = this.child.formGroup;

            if(form.controls.hasOwnProperty(key)){
                form.patchValue({
                    [key]: value
                });
            }

            this.child.showingDialog = true;
        })
    }

    onResetPassword(item: User){
        console.log('reset');
    }
}
