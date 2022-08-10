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

                this.updateDataStore();
            })
        );
    }

    create(body: Object): Observable<User> {
        const url: string = `${this.apiUrl}/v1/users`;

        return this.http.post<User>(url, body, { headers: this.token }).pipe(
            tap(
                (res: any) => {
                    if (res.statusCode === 201 && res?.data) {
                        this.dataStore.items.push(res.data);
                        this.updateDataStore();
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

    removeOne(id: number) {
        const url: string = `${this.apiUrl}/v1/users/${id}`;

        const result = this.http
            .delete<User>(url, { headers: this.token })
            .pipe(
                tap(
                    (res: any) => {
                        if (res.statusCode === 200 && res?.data) {
                            const filtered = this.dataStore.items.filter(
                                (value) => value.id !== id
                            );
                            this.dataStore.items = filtered;
                            const users = Object.assign([
                                ...this.dataStore.items,
                            ]);
                            this.users.next(users);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'ສຳເລັດ',
                                detail: 'ລົບຂໍ້ມູນສຳເລັດ',
                            });
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

    update(id: number, body: Object): Observable<User> {
        const url: string = `${this.apiUrl}/v1/users/${id}`;

        return this.http.patch<User>(url, body, { headers: this.token }).pipe(
            tap(
                (res: any) => {
                    if (res?.statusCode === 200 && res?.data) {
                        this.dataStore.items.forEach((e, i) => {
                            if (e.id === id) {
                                this.dataStore.items[i] = res.data;
                            }
                        });
                        this.updateDataStore();
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

    updateDataStore(): void {
        const items = Object.assign([...this.dataStore.items]);
        const sortedUsers = items.sort((a, b): any => b.id - a.id);
        this.users.next(sortedUsers);
    }

    defaultPassword(id: number): Observable<User> {
        const url: string = `${this.apiUrl}/v1/users/defaultPassword/${id}`;

        const result = this.http.patch<User>(url, { headers: this.token }).pipe(
            tap(
                (res: any) => {
                    if (res.statusCode === 200 && res?.data) {
                        this.dataStore.items.forEach((e, i) => {
                            if (e.id === id) {
                                this.dataStore.items[i] = res.data;
                            }
                        });

                        this.updateDataStore();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'ສຳເລັດ',
                            detail: 'ລົບຂໍ້ມູນສຳເລັດ',
                        });
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

    deleteSelected(selectedItems: User[]) {
        let ids = [];
        selectedItems.forEach((val) => {
            ids.push(val.id);
        });
        const url: string = `${this.apiUrl}/v1/users/removeSelected/${ids}`;

        const result = this.http.delete<any>(url, { headers: this.token }).pipe(
            tap(
                (res: any) => {
                    if (res.statusCode === 200 && res?.data) {
                        const filtered = this.dataStore.items.filter(
                            (value) => !selectedItems.includes(value)
                        );
                        this.dataStore.items = filtered;
                        const users = Object.assign([...this.dataStore.items]);
                        this.users.next(users);

                        this.messageService.add({
                            severity: 'success',
                            summary: 'ສຳເລັດ',
                            detail: 'ລົບຂໍ້ມູນສຳເລັດ',
                        });
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

    // resetPassword(id: number, body: Object): Observable<ResetPassword> {
    //     const url: string = `${this.apiUrl}/v1/users/resetPassword/${id}`;
    //     return this.http.patch<ResetPassword>(url, body, {headers: this.token});
    // }
}
