import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {authActions} from '../store/auth/auth.actions';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HealthCheckService {
    private readonly apiUrl = 'https://st-backend-api-kdr8.onrender.com/api/v1/swagger-ui/index.html';

    constructor(private http: HttpClient) {
    }

    getHealth(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }
}
