// src/app/core/services/assessment.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';
import { Assessment, AssessmentAttempt, CreateAssessmentRequest } from '../models/academic/assessment';

export interface AssessmentListParams {
    page?: number;
    size?: number;
    sort?: string;
}

@Injectable({
    providedIn: 'root',
})
export class AssessmentService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/assessments`;
    private unitsApiUrl = `${environment.apiUrl}/units`;

    /**
     * Lists all assessments with pageable support.
     */
    listAssessments(params: AssessmentListParams = {}): Observable<ApiResponse<PageableResponse<Assessment>>> {
        let httpParams = new HttpParams();
        if (params.page !== undefined) httpParams = httpParams.set('page', params.page);
        if (params.size !== undefined) httpParams = httpParams.set('size', params.size);
        if (params.sort) httpParams = httpParams.set('sort', params.sort);
        return this.http.get<ApiResponse<PageableResponse<Assessment>>>(this.apiUrl, { params: httpParams });
    }

    /**
     * Gets an assessment by ID.
     */
    getAssessmentById(id: string): Observable<Assessment> {
        return this.http.get<ApiResponse<Assessment>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Creates a new assessment.
     */
    createAssessment(body: CreateAssessmentRequest): Observable<Assessment> {
        return this.http.post<ApiResponse<Assessment>>(this.apiUrl, body).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Updates an assessment.
     */
    updateAssessment(id: string, body: Partial<CreateAssessmentRequest>): Observable<Assessment> {
        return this.http.patch<ApiResponse<Assessment>>(`${this.apiUrl}/${id}`, body).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Deletes an assessment.
     */
    deleteAssessment(id: string): Observable<void> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
            map(() => undefined)
        );
    }

    /**
     * Convenience wrapper — returns flat content array (page 0, size 100).
     * Prefer listAssessments() when pagination is needed.
     */
    getAssessments(): Observable<Assessment[]> {
        return this.listAssessments({ page: 0, size: 100 }).pipe(
            map((res) => res.data.content)
        );
    }

    /**
     * Gets assessments for a specific unit.
     */
    getUnitAssessments(unitId: string): Observable<Assessment[]> {
        return this.http.get<ApiResponse<PageableResponse<Assessment>>>(`${this.unitsApiUrl}/${unitId}/assessments`).pipe(
            map((response) => response.data.content)
        );
    }

    /**
     * Gets the attempt history for an assessment.
     */
    getAssessmentHistory(assessmentId: string): Observable<AssessmentAttempt[]> {
        return this.http.get<ApiResponse<AssessmentAttempt[]>>(`${this.apiUrl}/${assessmentId}/history`).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Submits an assessment result for a student.
     */
    submitAssessmentResult(assessmentId: string, studentId: string, resultData: Record<string, unknown>): Observable<unknown> {
        return this.http.post<ApiResponse<unknown>>(
            `${this.apiUrl}/${assessmentId}/results/${studentId}`,
            resultData
        ).pipe(map((response) => response.data));
    }
}
