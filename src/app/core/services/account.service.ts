import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { JwtService } from './jwt.service';

const USER_KEY = 'USER';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    apiUrl: string;
    user: User;

    constructor(
        private http: HttpClient,
        private storage: LocalStorageService,
        private router: Router,
        private jwtService: JwtService,
        private messageService: MessageService
    ) {
        this.apiUrl = environment.apiUrl;
    }

    setUserLogin(user): void {
        this.storage.store(USER_KEY, user);
    }

    setRole(role): void {
        this.storage.store('ROLE', role);
    }

    getUserLogin(): User {
        this.user = this.storage.retrieve(USER_KEY);
        return this.user;
    }

    clearLoggedUser(): void {
        this.storage.clear(USER_KEY);
    }

    getProfile(): Subscription {
        const url: string = `${this.apiUrl}/v1/auth/profile`;
        const token = this.jwtService.token();

        return this.http.get<any>(url, { headers: token }).subscribe(
            (res) => {
                if (res.statusCode === 200) {
                    const user = res?.data;
                    const role = (user.role?.name).toUpperCase();

                    this.setUserLogin(user);
                    this.setRole(role);

                    if (user.defaultPassword !== '' && user.defaultPassword !== null) {
                        this.router.navigateByUrl('/auth/reset-password');
                    } else {
                        this.checkUserRole(role);
                    }
                }
            },
            (error) => {
                const errorMessage = error.error.message;
                this.messageService.add({
                    severity: 'error',
                    summary: 'ບໍ່ໄດ້ຮັບອະນຸຍາດ',
                    detail: errorMessage,
                });
            }
        );
    }

    checkUserRole(roleName: string): void {
        const role = roleName.toUpperCase();

        if (role) {
            this.router.navigateByUrl('/');
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'ເກີດຂໍ້ຜິດພາດ',
                detail: 'ບັນຊີຂອງທ່ານຍັງບໍ່ໄດ້ຖືກກຳນົດໃຫ້ຢູ່ໃນ Role ໃດໆ',
            });
        }
    }
}
