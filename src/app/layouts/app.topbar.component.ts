import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { AppMainComponent } from './app.main.component';
import { BreadcrumbService } from '../shared/services/app.breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { AccountService } from '../core/services/account.service';
import { LocalStorageService } from 'ngx-webstorage';
import { User } from '../shared/interfaces/user.interface';
import { AuthService } from '../modules/auth/shared/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit, OnDestroy {
    subscription: Subscription;

    items: MenuItem[];
    user: User;

    constructor(
        public breadcrumbService: BreadcrumbService,
        public app: AppComponent,
        public appMain: AppMainComponent,
        private accountService: AccountService,
        private storage: LocalStorageService,
        private authService: AuthService
    ) {
        this.subscription = breadcrumbService.itemsHandler.subscribe(
            (response) => {
                this.items = response;
            }
        );
    }
    ngOnInit(): void {
        this.getLoggedUser();
    }

    getLoggedUser() {
        this.user = this.accountService.getUserLogin();
        this.storage.observe('USER').subscribe((value) => {
            this.user = value;
        });
    }

    logout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
