import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EventType, StudentHistory } from '../models/academic/student-history';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';

@Injectable({
  providedIn: 'root',
})
export class StudentHistoryService {
  private apiUrl = `${environment.apiUrl}/student-histories`;

  constructor(private http: HttpClient) {}

  /**
   * Gets all student histories.
   * @returns An observable containing an array of StudentHistory objects.
   */
  getStudentHistories(): Observable<StudentHistory[]> {
    return this.http.get<ApiResponse<PageableResponse<StudentHistory[]>>>(this.apiUrl).pipe(
      map((response) => response.data.content as StudentHistory[])
    );
  }

  /**
   * Creates a new student history.
   * @param studentHistory The student history data to create.
   * @returns An observable containing the created StudentHistory object.
   */
  createStudentHistory(studentHistory: Partial<StudentHistory>): Observable<StudentHistory> {
    return this.http.post<ApiResponse<StudentHistory>>(this.apiUrl, studentHistory).pipe(
      map((response) => response.data as StudentHistory)
    );
  }

  /**
   * Gets student histories by event type.
   * @param eventType The event type to filter by.
   * @returns An observable containing an array of StudentHistory objects.
   */
  getStudentHistoriesByEventType(eventType: EventType): Observable<StudentHistory[]> {
    return this.http.get<ApiResponse<PageableResponse<StudentHistory[]>>>(`${this.apiUrl}/by-event-type/${eventType}`).pipe(
      map((response) => response.data.content as StudentHistory[])
    );
  }

  /**
   * Gets student histories within a date range.
   * @param startDate The start date of the range.
   * @param endDate The end date of the range.
   * @returns An observable containing an array of StudentHistory objects.
   */
  getStudentHistoriesByDateRange(startDate: string, endDate: string): Observable<StudentHistory[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<ApiResponse<PageableResponse<StudentHistory[]>>>(`${this.apiUrl}/by-date-range`, { params }).pipe(
      map((response) => response.data.content as StudentHistory[])
    );
  }
}
