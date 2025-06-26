import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from './interfaces/ApiResponseService';

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
}
