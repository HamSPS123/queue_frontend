import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    ReactiveFormConfig,
    RxFormBuilder,
} from '@rxweb/reactive-form-validators';
import { LocalStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/core/services/account.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AuthService } from '../shared/auth.service';
import { NewPasswordModel } from '../shared/login.model';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    formGroup: FormGroup;
    submitted: boolean = false;
    userId: any;

    constructor(
        private fb: RxFormBuilder,
        private utilsService: UtilsService,
        private authService: AuthService,
        private storage: LocalStorageService,
        private messageService: MessageService,
        private jwtService: JwtService,
        private accountService: AccountService

    ) {
        ReactiveFormConfig.set(this.utilsService.validationMessages);
        this.userId = this.storage.retrieve("USER");
    }

    get f() {
        return this.formGroup.controls;
    }



    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        let model = new NewPasswordModel();
        this.formGroup = this.fb.formGroup(model);
    }

    onSubmit() {
        this.submitted = true;

        if(this.formGroup.invalid){
            return;
        }

        const formData = this.formGroup.value;
        this.authService.resetPassword(+this.userId.id, formData).subscribe((res) =>{
            if(res.statusCode === 200){
                this.accountService.getProfile();
            }
        },(error) => {
            const errorMessage = error.error.message;
            this.messageService.add({ severity: 'error', summary: 'ເກີດຂໍ້ຜິດພາດ', detail: errorMessage });
        })

    }

    onLogout(){
       this.authService.logout();
    }
}
