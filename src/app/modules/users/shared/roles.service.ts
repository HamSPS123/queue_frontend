import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Role } from './users.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
    apiUrl: string;
    token: any;

    private dataStore: { items: Role[] } = { items: [] };
    private roles: BehaviorSubject<Role[] | null> = new BehaviorSubject(null);
    readonly roles$ = this.roles.asObservable();

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
   }

  getRoles() {
    const url: string = `${this.apiUrl}/v1/roles`;

    return this.http.get<Role[]>(url).pipe(
        tap((res: any) => {
            this.dataStore.items = res.data;

            this.roles.next(Object.assign({}, this.dataStore).items);
        })
    );
}
}
