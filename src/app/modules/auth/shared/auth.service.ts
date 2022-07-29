import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtService } from 'src/app/core/services/jwt.service';
import { environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    apiUrl: string;
    roleAs: string;

    constructor(
        private http: HttpClient,
        private storage: LocalStorageService,
        private jwtService: JwtService
    ) {
        this.apiUrl = environment.apiUrl;
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

        if(token) {
            return true;
        }else{
            return false;
        }
    }

    getRole(){
        this.roleAs = this.storage.retrieve('ROLE');
        return this.roleAs;
    }

    refreshToken(token: string){
        const url: string = `${this.apiUrl}/accounts/auth/refreshtoken`;
        return this.http.post(url, {
            refreshToken: token
        }, httpOptions)
    }

    logout(){
        this.jwtService.clearToken();
        this.storage.clear();
        window.location.reload();
    }

    public handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}
