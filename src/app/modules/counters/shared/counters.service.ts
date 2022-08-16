import { tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { DialogService } from './../../../shared/services/dialog.service';
import { JwtService } from './../../../core/services/jwt.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Counters } from './counters.interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CountersService {
    apiUrl: string;
    token: any;

    private dataStore: { items: Counters[] } = { items: [] };
    private counters: BehaviorSubject<Counters[] | null> = new BehaviorSubject(
        null
    );
    readonly counters$ = this.counters.asObservable();

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
        const url: string = `${this.apiUrl}/v1/counters`;

        return this.http.get<Counters[]>(url).pipe(
            tap((res: any) => {
                this.dataStore.items = res.data;

                this.updateDataStore();
            })
        );
    }

    create(body: Object): Observable<Counters> {
        const url: string = `${this.apiUrl}/v1/counters`;

        const result = this.http.post<Counters>(url, body).pipe(
            tap((res: any) => {
                if (res.statusCode === 201 && res?.data) {
                    this.dataStore.items.push(res.data);
                    this.updateDataStore();
                    this.dialogService.showDialog(false);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'ສຳເລັດ',
                        detail: 'ເພີ່ມຂໍ້ມູນສຳເລັດ',
                    });
                }
            })
        );
        return result;
    }

    update(id: number, body: Object): Observable<Counters> {
        const url: string = `${this.apiUrl}/v1/counters/${id}`;

        const result = this.http.patch<Counters>(url, body).pipe(
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

                        this.messageService.add({
                            severity: 'success',
                            summary: 'ສຳເລັດ',
                            detail: 'ແກ້ໄຂຂໍ້ມູນສຳເລັດ',
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

    removeOne(id: number) {
        const url: string = `${this.apiUrl}/v1/counters/${id}`;

        const result = this.http.delete<Counters>(url).pipe(
            tap(
                (res: any) => {
                    if (res.statusCode === 200 && res?.data) {
                        const filtered = this.dataStore.items.filter(
                            (value) => value.id !== id
                        );
                        this.dataStore.items = filtered;
                        const counters = Object.assign([
                            ...this.dataStore.items,
                        ]);
                        this.counters.next(counters);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'ສຳເລັດ',
                            detail: 'ລົບຂໍ້ມູນສຳເລັດ',
                        });
                    }
                    // this.updateDataStore();
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

    deleteSelected(selectedItems: Counters[]) {
        let ids = [];
        selectedItems.forEach((val) => {
            ids.push(val.id);
        });
        const url: string = `${this.apiUrl}/v1/counters/removeSelected/${ids}`;

        const result = this.http.delete<any>(url).pipe(
            tap(
                (res: any) => {
                    if (res.statusCode === 200 && res?.data) {
                        const filtered = this.dataStore.items.filter(
                            (value) => !selectedItems.includes(value)
                        );
                        this.dataStore.items = filtered;
                        const counters = Object.assign([
                            ...this.dataStore.items,
                        ]);
                        this.counters.next(counters);

                        this.messageService.add({
                            severity: 'success',
                            summary: 'ສຳເລັດ',
                            detail: 'ລົບຂໍ້ມູນສຳເລັດ',
                        });
                    }
                    // this.updateDataStore();
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

    updateDataStore(): void {
        const items = Object.assign([...this.dataStore.items]);
        const sortedCounters = items.sort((a, b): any => b.id - a.id);
        this.counters.next(sortedCounters);
    }
}
