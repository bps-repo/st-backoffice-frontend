// src/app/core/services/meeting.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';
import {
    CreateMeetingRequest,
    Meeting,
    MeetingListFilter,
    UpdateMeetingRequest,
} from '../models/academic/meeting';

@Injectable({ providedIn: 'root' })
export class MeetingService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/meetings`;

    getMeetings(filter: MeetingListFilter = {}): Observable<Meeting[]> {
        let params = new HttpParams();

        if (filter.studentId) params = params.set('studentId', filter.studentId);
        if (filter.employeeId) params = params.set('employeeId', filter.employeeId);
        if (filter.status) params = params.set('status', filter.status);
        if (filter.startAt) params = params.set('startAt', filter.startAt);
        if (filter.endAt) params = params.set('endAt', filter.endAt);

        return this.http
            .get<ApiResponse<Meeting[]>>(this.apiUrl, { params })
            .pipe(map((res) => res.data));
    }

    createMeeting(payload: CreateMeetingRequest): Observable<Meeting> {
        return this.http
            .post<ApiResponse<Meeting>>(this.apiUrl, payload)
            .pipe(map((res) => res.data));
    }

    getMeetingsByUser(userId: string): Observable<Meeting[]> {
        return this.http
            .get<ApiResponse<Meeting[]>>(`${this.apiUrl}/user/${userId}`)
            .pipe(map((res) => res.data));
    }

    getMeetingById(id: string): Observable<Meeting> {
        return this.http
            .get<ApiResponse<Meeting>>(`${this.apiUrl}/${id}`)
            .pipe(map((res) => res.data));
    }

    updateMeeting(id: string, payload: UpdateMeetingRequest): Observable<Meeting> {
        return this.http
            .patch<ApiResponse<Meeting>>(`${this.apiUrl}/${id}`, payload)
            .pipe(map((res) => res.data));
    }
}
