import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
    ReactiveFormConfig,
    RxFormBuilder,
} from '@rxweb/reactive-form-validators';
import { MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { RolesService } from '../shared/roles.service';
import { Role, User } from '../shared/users.interface';
import { RoleModel, UserModel } from '../shared/users.model';
import { UsersService } from '../shared/users.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
    showingDialog: boolean;
    dialogTitle: string = '';
    formGroup: FormGroup;
    submitted: boolean;
    item: User;

    userId: string;

    spinner$: Observable<boolean>;
    roles$: Observable<Role[]>;

    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private store: Store<any>,
        private fb: RxFormBuilder,
        private dialogService: DialogService,
        private utilsService: UtilsService,
        private roleService: RolesService,
        private route: ActivatedRoute,
        private usersService: UsersService,
        private messageService: MessageService
    ) {
        ReactiveFormConfig.set(this.utilsService.validationMessages);
    }

    get f() {
        return this.formGroup.controls;
    }

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('id');

        this.initForm();
        this.spinner$ = this.store.pipe(select((state) => state.spinner.isOn));
        this.dialogService.dialog$.subscribe(
            (value) => (this.showingDialog = value)
        );
    }

    initForm() {
        const model = new UserModel();
        model.role = new RoleModel();
        this.formGroup = this.fb.formGroup(model);
    }

    onShowDialog() {
        this.getRoles();
    }

    getRoles(): void {
        this.roleService.getRoles().subscribe();
        this.roles$ = this.roleService.roles$;
    }

    onSave() {
        this.submitted = true;

        if (this.formGroup.invalid) {
            return;
        }

        const id = this.item?.id;
        const formData = this.formGroup.value;

        if (id) {
            this.usersService.update(+id, formData).subscribe();

            this.messageService.add({
                severity: 'success',
                summary: 'ສຳເລັດ',
                detail: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ',
            });
        } else {
            this.usersService.create(formData).subscribe();
            this.messageService.add({
                severity: 'success',
                summary: 'ສຳເລັດ',
                detail: 'ເພີ່ມຂໍ້ມູນສຳເລັດ',
            });
        }
    }

    onHideDialog() {
        this.showingDialog = false;
        this.submitted = false;
        this.formGroup.reset();
        this.formGroup.enable();
    }
}
