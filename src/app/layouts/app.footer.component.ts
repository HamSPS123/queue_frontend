import { Component } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';
import { AccountService } from '../core/services/account.service';
import { User } from '../shared/interfaces/user.interface';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
})
export class AppFooterComponent {
    user: User;
    appVersioin: string;
    constructor(
        public app: AppComponent,
        private accountService: AccountService,
        private storage: LocalStorageService
    ) {
        this.appVersioin = environment.version;
    }

    getLoggedUser() {
        this.user = this.accountService.getUserLogin();
        this.storage.observe('USER').subscribe((value) => {
            this.user = value;
        });
    }
}
