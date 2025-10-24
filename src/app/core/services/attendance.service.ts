import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';
import { AttendanceStatusUpdate } from '../models/academic/attendance-update';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendances`;

  constructor(private http: HttpClient) {}

  getAttendances(): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.apiUrl).pipe(
      map((response) => response.data.content as any[])
    );
  }


  getAttendanceById(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  createAttendance(attendanceData: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, attendanceData).pipe(
      map((response) => response.data)
    );
  }

  getAttendancesByStudent(studentId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-student/${studentId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  getAttendancesByPresent(present: boolean): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-present/${present}`).pipe(
      map((response) => response.data.content as any[])
    );
  }


  getAttendancesByDate(date: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-date/${date}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  getAttendancesByLessonId(lessonId: string): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/search?lessonId=${lessonId}`).pipe(
      map((response) => response.data)
    );
  }


  updateAttendance(id: string, attendanceData: any): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}`, attendanceData).pipe(
      map((response) => response.data)
    );
  }

  updateAttendanceStatus(attendanceId: string, statusUpdate: AttendanceStatusUpdate): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${attendanceId}`, statusUpdate).pipe(
      map((response) => response.data)
    );
  }

  deleteAttendance(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }
}
