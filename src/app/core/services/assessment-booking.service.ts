// src/app/core/services/assessment-booking.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';
import { AssessmentBooking, BulkBookingRequest, BulkBookingResultEntry } from '../models/academic/assessment-booking';

@Injectable({
    providedIn: 'root',
})
export class AssessmentBookingService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/assessment-bookings`;

    getBookingsByAssessment(assessmentId: string): Observable<AssessmentBooking[]> {
        return this.http
            .get<ApiResponse<AssessmentBooking[]>>(`${this.apiUrl}/assessment/${assessmentId}`)
            .pipe(map((res) => res.data));
    }

    bulkBook(request: BulkBookingRequest): Observable<BulkBookingResultEntry[]> {
        return this.http
            .post<ApiResponse<BulkBookingResultEntry[]>>(`${this.apiUrl}/bulk`, request)
            .pipe(map((res) => res.data));
    }
}
