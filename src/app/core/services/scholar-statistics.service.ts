import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse} from '../models/ApiResponseService';

@Injectable({
    providedIn: 'root',
})
export class ScholarStatisticsService {
    private apiUrl = `${environment.apiUrl}/scholar/statistics`;

    constructor(private http: HttpClient) {
    }

    getStatistics(): Observable<any> {
        return this.http.get<ApiResponse<any>>(this.apiUrl).pipe(
            map((response) => response.data)
        );
    }

    getStudentStatistics(studentId: string): Observable<any> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/student/${studentId}`).pipe(
            map((response) => response.data)
        );
    }

    getMonthlyTrends(dateFrom?: Date, dateTo?: Date, groupBy: string = 'month'): Observable<any> {
        const trendsUrl = `${environment.apiUrl}/dashboards/schoolar/general/trends`;
        let params = new HttpParams().set('groupBy', groupBy);

        if (dateFrom) {
            params = params.set('dateFrom', dateFrom.toISOString());
        }
        if (dateTo) {
            params = params.set('dateTo', dateTo.toISOString());
        }

        return this.http.get<ApiResponse<any>>(trendsUrl, {params}).pipe(
            map((response) => response.data)
        );
    }

    getDashboardStatistics(): Observable<any> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/dashboard`).pipe(
            map((response) => response.data)
        );
    }

    getLessonsDashboardStatistics(): Observable<any> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/lessons/dashboard`).pipe(
            map((response) => response.data)
        );
    }
}
