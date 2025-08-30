import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) {
    }

    login(username: string, password: string) {
        console.log('login', username, password);
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
