import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MenusService {
    constructor(private http: HttpClient) {}

    getAdminMenus() {
        return this.http
            .get<any>('assets/data/admin-menu.json')
            .toPromise()
            .then((res) => res.data as any[])
            .then((data) => data);
    }

    getStaffMenus() {
        return this.http
            .get<any>('assets/data/staff-menu.json')
            .toPromise()
            .then((res) => res.data as any[])
            .then((data) => data);
    }
}
