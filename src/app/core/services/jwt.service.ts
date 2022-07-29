import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

const TOKEN_KEY = 'token';
const REFRESHTOKEN_KEY = 'refreshtoken';

@Injectable({
    providedIn: 'root',
})
export class JwtService {
    constructor(private storage: LocalStorageService) {}

    setToken(token: string) {
        this.storage.clear(TOKEN_KEY);
        this.storage.store(TOKEN_KEY, token);
    }

    getToken() {
        return this.storage.retrieve(TOKEN_KEY);
    }

    setRefreshToken(token: string) {
        this.storage.clear(REFRESHTOKEN_KEY);
        this.storage.store(REFRESHTOKEN_KEY, token);
    }

    getRefreshToken() {
        return this.storage.retrieve(REFRESHTOKEN_KEY);
    }

    clearToken() {
        this.storage.clear(TOKEN_KEY);
    }

    token() {
        const token = this.getToken();

        return {
            Authorization: 'Bearer ' + token,
        };
    }
}
