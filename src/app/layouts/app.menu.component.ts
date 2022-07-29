import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { AccountService } from '../core/services/account.service';
import { MenusService } from '../core/services/menus.service';
import { User } from '../shared/interfaces/user.interface';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    user: User;
    model: any[];

    constructor(
        public appMain: AppMainComponent,
        private accountService: AccountService,
        private storage: LocalStorageService,
        private menusService: MenusService
    ) {}

    ngOnInit() {
        this.getLoggedUser();
        const role = this.user?.role?.name;

        if (role === 'Admin') {
            this.menusService.getAdminMenus().then(data => this.model = data);
        } else {
            this.menusService.getStaffMenus().then(data => this.model = data);
        }
    }

    getLoggedUser() {
        this.user = this.accountService.getUserLogin();
        this.storage.observe('USER').subscribe((value) => {
            this.user = value;
        });
    }
}
