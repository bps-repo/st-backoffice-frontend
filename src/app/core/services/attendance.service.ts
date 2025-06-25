import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from './interfaces/ApiResponseService';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendances`;

  constructor(private http: HttpClient) {}

  /**
   * Gets all attendances.
   * @returns An observable containing an array of Attendance objects.
   */
  getAttendances(): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.apiUrl).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets an attendance by ID.
   * @param id The ID of the attendance.
   * @returns An observable containing the Attendance object.
   */
  getAttendanceById(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Creates a new attendance.
   * @param attendanceData The attendance data to create.
   * @returns An observable containing the created Attendance object.
   */
  createAttendance(attendanceData: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, attendanceData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Gets attendances for a specific student.
   * @param studentId The ID of the student.
   * @returns An observable containing an array of Attendance objects.
   */
  getAttendancesByStudent(studentId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-student/${studentId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets attendances by present status.
   * @param present The present status to filter by.
   * @returns An observable containing an array of Attendance objects.
   */
  getAttendancesByPresent(present: boolean): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-present/${present}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets attendances by date.
   * @param date The date to filter by.
   * @returns An observable containing an array of Attendance objects.
   */
  getAttendancesByDate(date: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-date/${date}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Updates the status of an attendance.
   * @param attendanceId The ID of the attendance.
   * @param status The new status.
   * @returns An observable containing the updated Attendance object.
   */
  updateAttendanceStatus(attendanceId: string, status: any): Observable<any> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${attendanceId}/status`, status).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Updates an attendance.
   * @param id The ID of the attendance.
   * @param attendanceData The updated attendance data.
   * @returns An observable containing the updated Attendance object.
   */
  updateAttendance(id: string, attendanceData: any): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}`, attendanceData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Deletes an attendance.
   * @param id The ID of the attendance to delete.
   * @returns An observable containing the response.
   */
  deleteAttendance(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }
}
