import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtService } from 'src/app/core/services/jwt.service';
import { environment } from 'src/environments/environment';
import { User } from '../../users/shared/users.interface';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    apiUrl: string;
    roleAs: string;
    token: any;

    constructor(
        private http: HttpClient,
        private storage: LocalStorageService,
        private jwtService: JwtService,
        private messageService: MessageService,
        private router: Router,
    ) {
        this.apiUrl = environment.apiUrl;
        this.token = this.jwtService.token();
    }

    login(body: Object) {
        const url: string = `${this.apiUrl}/v1/auth/login`;

        const response = this.http
            .post<any>(url, body)
            .pipe(catchError(this.handleError));

        return response;
    }

    isAuthenticated(): boolean {
        const token = this.jwtService.getToken();

        if (token) {
            return true;
        } else {
            return false;
        }
    }

    getRole() {
        this.roleAs = this.storage.retrieve('ROLE');
        return this.roleAs;
    }

    refreshToken(token: string) {
        const url: string = `${this.apiUrl}/accounts/auth/refreshtoken`;
        return this.http.post(
            url,
            {
                refreshToken: token,
            },
            httpOptions
        );
    }

    logout() {
        this.jwtService.clearToken();
        this.storage.clear();
        window.location.reload();
    }

    resetPassword(id: number, body: Object) {
        const url = `${this.apiUrl}/v1/users/resetPassword/${id}`;

        console.log(body);

        const result = this.http
            .patch<User>(url, body)
            .pipe(
                tap(
                    (res: any) => {
                        if (res.statusCode === 200) {
                            this.router.navigateByUrl('/');
                        }
                    },
                    (error) => {
                        const errorMsg = error.error.message;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'ເກີດຂໍ້ຜິດພາດ',
                            detail: errorMsg,
                        });
                    }
                )
            );

            return result;
    }

    public handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}
