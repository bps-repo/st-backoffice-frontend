import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private unitsApiUrl = `${environment.apiUrl}/units`;
  private assessmentsApiUrl = `${environment.apiUrl}/assessments`;

  constructor(private http: HttpClient) {}

  /**
   * Gets assessments for a specific unit.
   * @param unitId The ID of the unit.
   * @returns An observable containing an array of Assessment objects.
   */
  getUnitAssessments(unitId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.unitsApiUrl}/${unitId}/assessments`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets all assessments.
   * @returns An observable containing an array of Assessment objects.
   */
  getAssessments(): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.assessmentsApiUrl).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets an assessment by ID.
   * @param id The ID of the assessment.
   * @returns An observable containing the Assessment object.
   */
  getAssessmentById(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.assessmentsApiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Creates a new assessment for a unit.
   * @param unitId The ID of the unit.
   * @param assessmentData The assessment data to create.
   * @returns An observable containing the created Assessment object.
   */
  createAssessment(unitId: string, assessmentData: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.unitsApiUrl}/${unitId}/assessments`, assessmentData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Updates an assessment.
   * @param id The ID of the assessment.
   * @param assessmentData The updated assessment data.
   * @returns An observable containing the updated Assessment object.
   */
  updateAssessment(id: string, assessmentData: any): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.assessmentsApiUrl}/${id}`, assessmentData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Deletes an assessment.
   * @param id The ID of the assessment to delete.
   * @returns An observable containing the response.
   */
  deleteAssessment(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.assessmentsApiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Gets assessments by type.
   * @param type The type to filter by.
   * @returns An observable containing an array of Assessment objects.
   */
  getAssessmentsByType(type: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.assessmentsApiUrl}/by-type/${type}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets assessments by date range.
   * @param startDate The start date.
   * @param endDate The end date.
   * @returns An observable containing an array of Assessment objects.
   */
  getAssessmentsByDateRange(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.assessmentsApiUrl}/by-date-range/${startDate}/${endDate}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets assessments by student.
   * @param studentId The ID of the student.
   * @returns An observable containing an array of Assessment objects.
   */
  getAssessmentsByStudent(studentId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.assessmentsApiUrl}/by-student/${studentId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Submits an assessment result for a student.
   * @param assessmentId The ID of the assessment.
   * @param studentId The ID of the student.
   * @param resultData The result data to submit.
   * @returns An observable containing the submitted result.
   */
  submitAssessmentResult(assessmentId: string, studentId: string, resultData: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.assessmentsApiUrl}/${assessmentId}/results/${studentId}`, resultData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Gets assessment results for a student.
   * @param studentId The ID of the student.
   * @returns An observable containing an array of assessment results.
   */
  getStudentAssessmentResults(studentId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.assessmentsApiUrl}/results/student/${studentId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets assessment results for an assessment.
   * @param assessmentId The ID of the assessment.
   * @returns An observable containing an array of assessment results.
   */
  getAssessmentResults(assessmentId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.assessmentsApiUrl}/${assessmentId}/results`).pipe(
      map((response) => response.data.content as any[])
    );
  }
}
