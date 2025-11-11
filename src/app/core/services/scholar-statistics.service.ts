import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';

@Injectable({
  providedIn: 'root',
})
export class ScholarStatisticsService {
  private apiUrl = `${environment.apiUrl}/scholar/statistics`;

  constructor(private http: HttpClient) {}

  /**
   * Gets general scholar statistics.
   * @returns An observable containing the statistics data.
   */
  getStatistics(): Observable<any> {
    return this.http.get<ApiResponse<any>>(this.apiUrl).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Gets statistics for a specific student.
   * @param studentId The ID of the student.
   * @returns An observable containing the student statistics data.
   */
  getStudentStatistics(studentId: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/student/${studentId}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Gets monthly evolution trends data.
   * @param dateFrom Optional start date (ISO 8601).
   * @param dateTo Optional end date (ISO 8601).
   * @param groupBy Optional grouping parameter (day|week|month).
   * @returns An observable containing the trends data with labels and datasets.
   */
  getMonthlyTrends(dateFrom?: Date, dateTo?: Date, groupBy: string = 'month'): Observable<any> {
    const trendsUrl = `${environment.apiUrl}/dashboards/schoolar/general/trends`;
    let params = new HttpParams().set('groupBy', groupBy);

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom.toISOString());
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo.toISOString());
    }

    return this.http.get<ApiResponse<any>>(trendsUrl, { params }).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Gets student dashboard statistics.
   * @returns An observable containing the dashboard statistics data.
   */
  getDashboardStatistics(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/dashboard`).pipe(
      map((response) => response.data)
    );
  }
}
