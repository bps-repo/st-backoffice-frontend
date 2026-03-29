import {HttpClient} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/auth`;

    login(username: string, password: string) {
        return this.http.post<any>(`${this.apiUrl}/login`, {username, password});
    }

    logout() {
        return of(true);
    }

    refreshToken(refreshToken: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/refresh-token`, {refreshToken});
    }

    verify(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/verify`);
    }
}
