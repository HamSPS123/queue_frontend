import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    PasswordModule,
    ButtonModule,
    ToastModule
  ]
})
export class ResetPasswordModule { }
