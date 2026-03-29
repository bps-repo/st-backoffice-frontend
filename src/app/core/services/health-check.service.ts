import { Injectable, inject } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HealthCheckService {
    private http = inject(HttpClient);

    private readonly apiUrl = 'https://st-backend-api-kdr8.onrender.com/api/v1/swagger-ui/index.html';

    getHealth(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }
}
