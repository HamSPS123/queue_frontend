import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';

import {
    ReactiveFormConfig,
    RxFormBuilder,
} from '@rxweb/reactive-form-validators';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/core/services/account.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { AuthService } from '../shared/auth.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { LoginModel } from '../shared/login.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    logo = '../../../../assets/images/biclogo.png';
    formGroup: FormGroup;
    submitted: boolean = false;
    spinner$: Observable<boolean>;

    constructor(
        private store: Store<any>,
        private fb: RxFormBuilder,
        private utilsService: UtilsService,
        private jwtService: JwtService,
        private authService: AuthService,
        private messageService: MessageService,
        private accountService: AccountService
    ) {
        ReactiveFormConfig.set(this.utilsService.validationMessages);
    }
    get f() {
        return this.formGroup.controls;
    }

    ngOnInit(): void {
        this.initForm();
        this.spinner$ = this.store.pipe(select((state) => state.spinner.isOn));
    }

    initForm() {
        let model = new LoginModel();
        this.formGroup = this.fb.formGroup(model);
    }

    login() {
        this.submitted = true;

        if (this.formGroup.invalid) {
            return;
        }

        const formData = this.formGroup.value;


        this.authService.login(formData).subscribe((res) => {

            if (res.statusCode === 200) {
                const token = res.data.accessToken;

                this.jwtService.setToken(token);
                this.accountService.getProfile();

            }
        }, (error) => {
            const errorMessage = error?.error?.message;
            this.messageService.add({ severity: 'error', summary: 'ບໍ່ໄດ້ຮັບອະນຸຍາດ', detail: errorMessage });
        });
    }
}
