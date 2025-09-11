import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Lesson} from "../models/academic/lesson";
import {Observable, of} from 'rxjs';
import {ApiResponse, PageableResponse} from "./interfaces/ApiResponseService";
import {map} from "rxjs/operators";
import {BulkBookingRequest, BulkBookingResult} from "../models/academic/bulk-booking";
import {AvailableStudent} from "../models/academic/available-student";

@Injectable({
    providedIn: 'root',
})
export class LessonService {
    private apiUrl = `${environment.apiUrl}/lessons`;

    constructor(private readonly http: HttpClient) {
    }

    getLessons(): Observable<Lesson[]> {
        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/search`).pipe(
            map((response) => response.data as Lesson[])
        )
    }

    /**
     * Get all lessons without pagination for calendar and list views
     */
    getAllLessons(): Observable<Lesson[]> {
        return this.http.get<ApiResponse<PageableResponse<Lesson[]>>>(`${this.apiUrl}?page=0&size=1000`).pipe(
            map((response) => response.data.content as Lesson[])
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

    /**
     * Search lessons by date range (and optionally other criteria) using the unified /lessons/search endpoint.
     * This is a backward-compatible helper for date-range only queries.
     */
    getLessonsByDateRange(startDate: string, endDate: string): Observable<Lesson[]> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);

        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/search`, { params }).pipe(
            map((response) => response.data as Lesson[])
        );
    }

    /**
     * Generic search for lessons with all supported filters.
     * queryparams: [unitId, startDate, endDate, centerId, online, status, teacherId, titleContains]
     */
    searchLessons(filters: {
        unitId?: string;
        startDate?: string;
        endDate?: string;
        centerId?: string;
        online?: boolean;
        status?: string; // AVAILABLE | COMPLETE | OVERDUE | CANCELLED
        teacherId?: string;
        titleContains?: string;
        page?: number;
        size?: number;
    }): Observable<Lesson[]> {
        let params = new HttpParams();
        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value));
            }
        });
        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/search`, { params }).pipe(
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
        return this.http.delete<void>(`${this.apiUrl}/${lessonId}/bookings`, {params});
    }

    // Lesson management endpoints
    updateLessonSchedule(lessonId: string, scheduleData: any): Observable<Lesson> {
        return this.http.put<ApiResponse<Lesson>>(`${this.apiUrl}/${lessonId}/schedule`, scheduleData).pipe(
            map((response) => response.data as Lesson)
        );
    }

    updateLessonOnlineStatus(lessonId: string, onlineStatus: boolean): Observable<Lesson> {
        return this.http.put<ApiResponse<Lesson>>(`${this.apiUrl}/${lessonId}/online-status`, {online: onlineStatus}).pipe(
            map((response) => response.data as Lesson)
        );
    }

    markLessonsOverdue(): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/mark-overdue`, {}).pipe(
            map((response) => response.data)
        );
    }

    // Bulk booking endpoint
    bulkBookLessons(bulkBookingRequest: BulkBookingRequest): Observable<BulkBookingResult> {
        return this.http.post<ApiResponse<BulkBookingResult>>(`${this.apiUrl}/bookings/bulk`, bulkBookingRequest).pipe(
            map((response) => response.data)
        );
    }

    // Get available students for a specific lesson
    getAvailableStudentsForLesson(lessonId: string): Observable<AvailableStudent[]> {
        return this.http.get<ApiResponse<AvailableStudent[]>>(`${this.apiUrl}/${lessonId}/available-students`).pipe(
            map((response) => response.data as AvailableStudent[])
        );
    }
}
