import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Lesson} from "../models/academic/lesson";
import {Observable, of} from 'rxjs';
import {ApiResponse} from "./interfaces/ApiResponseService";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class LessonApiService {
    private apiUrl = `${environment.apiUrl}/lessons`;

    constructor(private http: HttpClient) {
    }

    getLessons(): Observable<Lesson[]> {
        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}`).pipe(
            map((response) => response.data as Lesson[])
        )
    }

    getLesson(id: string): Observable<Lesson> {
        return this.http.get<ApiResponse<Lesson>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data as Lesson)
        );
    }

    createLesson(lessonData: Lesson): Observable<Lesson> {
        return this.http.post<ApiResponse<Lesson>>(`${this.apiUrl}`, lessonData).pipe(
            map((response) => response.data as Lesson)
        );
    }

    updateLesson(lessonData: Lesson): Observable<Lesson> {
        return this.http.put<ApiResponse<Lesson>>(`${this.apiUrl}/${lessonData.id}`, lessonData).pipe(
            map((response) => response.data as Lesson)
        );
    }

    deleteLesson(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Filter endpoints
    getLessonsByClass(classId: string): Observable<Lesson[]> {
        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/filter/class/${classId}`).pipe(
            map((response) => response.data as Lesson[])
        );
    }

    getAvailableLessonsByClass(classId: string): Observable<Lesson[]> {
        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/filter/class/${classId}/available`).pipe(
            map((response) => response.data as Lesson[])
        );
    }

    getLessonsByCenter(centerId: string): Observable<Lesson[]> {
        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/filter/center/${centerId}`).pipe(
            map((response) => response.data as Lesson[])
        );
    }

    getLessonsByDateRange(startDate: string, endDate: string): Observable<Lesson[]> {
        let params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);

        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/filter/date-range`, { params }).pipe(
            map((response) => response.data as Lesson[])
        );
    }

    // Student bookings endpoints
    getStudentBookings(studentId: string): Observable<any[]> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/students/${studentId}/bookings`).pipe(
            map((response) => response.data as any[])
        );
    }

    getStudentBookingsToday(studentId: string): Observable<any[]> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/students/${studentId}/bookings/today`).pipe(
            map((response) => response.data as any[])
        );
    }

    // Lesson bookings endpoints
    getLessonBookings(lessonId: string): Observable<any[]> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/${lessonId}/bookings`).pipe(
            map((response) => response.data as any[])
        );
    }

    createLessonBooking(lessonId: string, bookingData: any): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${lessonId}/bookings`, bookingData).pipe(
            map((response) => response.data)
        );
    }

    deleteLessonBooking(lessonId: string, bookingId: string): Observable<void> {
        let params = new HttpParams().set('bookingId', bookingId);
        return this.http.delete<void>(`${this.apiUrl}/${lessonId}/bookings`, { params });
    }

    // Lesson management endpoints
    updateLessonSchedule(lessonId: string, scheduleData: any): Observable<Lesson> {
        return this.http.put<ApiResponse<Lesson>>(`${this.apiUrl}/${lessonId}/schedule`, scheduleData).pipe(
            map((response) => response.data as Lesson)
        );
    }

    updateLessonOnlineStatus(lessonId: string, onlineStatus: boolean): Observable<Lesson> {
        return this.http.put<ApiResponse<Lesson>>(`${this.apiUrl}/${lessonId}/online-status`, { online: onlineStatus }).pipe(
            map((response) => response.data as Lesson)
        );
    }

    markLessonsOverdue(): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/mark-overdue`, {}).pipe(
            map((response) => response.data)
        );
    }
}
