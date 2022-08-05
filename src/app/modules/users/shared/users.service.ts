import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtService } from 'src/app/core/services/jwt.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { environment } from 'src/environments/environment';
import { User } from './users.interface';
import { tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    apiUrl: string;
    token: any;

    private dataStore: { items: User[] } = { items: [] };
    private users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    readonly users$ = this.users.asObservable();

    constructor(
        private http: HttpClient,
        private jwtService: JwtService,
        private dialogService: DialogService,
        private messageService: MessageService
    ) {
        this.apiUrl = environment.apiUrl;
        this.token = this.jwtService.token();
    }

    findAll() {
        const url: string = `${this.apiUrl}/v1/users`;

        return this.http.get<User[]>(url, { headers: this.token }).pipe(
            tap((res: any) => {
                this.dataStore.items = res.data;

                this.users.next(Object.assign({}, this.dataStore).items);
            })
        );
    }

    create(body: Object): Observable<User> {
        const url: string = `${this.apiUrl}/v1/users`;

        return this.http.post<User>(url, body, { headers: this.token }).pipe(
            tap(
                (res: any) => {
                    if (res.statusCode === 201) {
                        this.dataStore.items.push(res.data);
                        this.users.next(
                            Object.assign([...this.dataStore.items])
                        );
                        this.dialogService.showDialog(false);
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
    }

    update(id: number, body: Object): Observable<User> {
        const url: string = `${this.apiUrl}/v1/users/${id}`;

        return this.http.patch<User>(url, body, { headers: this.token }).pipe(
            tap(
                (res: any) => {
                    if (res.statusCode === 200) {
                        this.dataStore.items.forEach((e, i) => {
                            if (e.id === id) {
                                this.dataStore.items[i] = res.data;
                            }
                        });

                        this.users.next(
                            Object.assign([...this.dataStore.items])
                        );
                        this.dialogService.showDialog(false);
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
    }

    // resetPassword(id: number, body: Object): Observable<ResetPassword> {
    //     const url: string = `${this.apiUrl}/v1/users/resetPassword/${id}`;
    //     return this.http.patch<ResetPassword>(url, body, {headers: this.token});
    // }
}
