import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtService } from 'src/app/core/services/jwt.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { environment } from 'src/environments/environment';
import { Services } from './services.interface';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    apiUrl: string;
    token: any;

    private dataStore: { items: Services[] } = { items: [] };
    private services: BehaviorSubject<Services[] | null> = new BehaviorSubject(
        null
    );
    readonly services$ = this.services.asObservable();

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
        const url: string = `${this.apiUrl}/v1/services`;

        return this.http.get<Services[]>(url).pipe(
            tap((res: any) => {
                this.dataStore.items = res.data;

                this.updateDataStore();
            })
        );
    }

    create(body: Object): Observable<Services> {
        const url: string = `${this.apiUrl}/v1/services`;

        const result = this.http.post<Services>(url, body).pipe(
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

    update(id: number, body: Object): Observable<Services> {
        const url: string = `${this.apiUrl}/v1/services/${id}`;

        const result = this.http.patch<Services>(url, body).pipe(
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
        const url: string = `${this.apiUrl}/v1/services/${id}`;

        const result = this.http.delete<Services>(url).pipe(
            tap(
                (res: any) => {
                    if (res.statusCode === 200 && res?.data) {
                        const filtered = this.dataStore.items.filter(
                            (value) => value.id !== id
                        );
                        this.dataStore.items = filtered;
                        const services = Object.assign([
                            ...this.dataStore.items,
                        ]);
                        this.services.next(services);
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

    deleteSelected(selectedItems: Services[]) {
        let ids = [];
        selectedItems.forEach((val) => {
            ids.push(val.id);
        });
        const url: string = `${this.apiUrl}/v1/services/removeSelected/${ids}`;

        const result = this.http.delete<any>(url).pipe(
            tap(
                (res: any) => {
                    if (res.statusCode === 200 && res?.data) {
                        const filtered = this.dataStore.items.filter(
                            (value) => !selectedItems.includes(value)
                        );
                        this.dataStore.items = filtered;
                        const services = Object.assign([
                            ...this.dataStore.items,
                        ]);
                        this.services.next(services);

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

    updateDataStore(): void {
        const items = Object.assign([...this.dataStore.items]);
        const sortedServices = items.sort((a, b): any => b.id - a.id);
        this.services.next(sortedServices);
    }
}
