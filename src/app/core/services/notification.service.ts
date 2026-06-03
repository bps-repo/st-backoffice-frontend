import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse} from '../models/ApiResponseService';
import {Notification} from '../models/notification';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/notifications`;

    getByUser(userId: string, read?: boolean): Observable<Notification[]> {
        let params = new HttpParams();
        if (read !== undefined) {
            params = params.set('read', read.toString());
        }
        return this.http
            .get<ApiResponse<Notification[]>>(`${this.apiUrl}/user/${userId}`, {params})
            .pipe(map((r) => r.data));
    }

    markAsRead(id: string): Observable<Notification> {
        return this.http
            .patch<ApiResponse<Notification>>(`${this.apiUrl}/${id}/read`, {})
            .pipe(map((r) => r.data));
    }

    markAllAsRead(userId: string): Observable<void> {
        return this.http
            .patch<void>(`${this.apiUrl}/user/${userId}/read-all`, {});
    }
}
