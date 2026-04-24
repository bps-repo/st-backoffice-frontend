import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {environment} from 'src/environments/environment';
import {Lesson, LessonCreate} from "../models/academic/lesson";
import {Observable, of} from 'rxjs';
import {ApiResponse, PageableResponse} from "../models/ApiResponseService";
import {map} from "rxjs/operators";
import {BulkBookingRequest, BulkBookingResult} from "../models/academic/bulk-booking";
import {AvailableStudent} from "../models/academic/available-student";
import {StudentBooking} from "../models/academic/student-booking";

@Injectable({
    providedIn: 'root',
})
export class LessonService {
    private readonly http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/lessons`;

    getLessons(): Observable<Lesson[]> {
        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/search`).pipe(
            map((response) => response.data as Lesson[])
        )
    }

    getLessonsPaginated(page: number, size: number, sort?: string, status?: string): Observable<PageableResponse<Lesson>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        if (sort) params = params.set('sort', sort);
        if (status) params = params.set('status', status);
        return this.http.get<ApiResponse<PageableResponse<Lesson>>>(`${this.apiUrl}/search/paginated`, {params}).pipe(
            map((response) => response.data)
        );
    }

    getAllLessons(): Observable<Lesson[]> {
        return this.http.get<ApiResponse<PageableResponse<Lesson>>>(`${this.apiUrl}?page=0&size=1000`).pipe(
            map((response) => response.data.content as Lesson[])
        )
    }

    getLesson(id: string): Observable<Lesson> {
        return this.http.get<ApiResponse<Lesson>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data as Lesson)
        );
    }

    createLesson(lessonData: LessonCreate): Observable<Lesson> {
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


    getLessonsByCenter(centerId: string): Observable<Lesson[]> {
        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/filter/center/${centerId}`).pipe(
            map((response) => response.data as Lesson[])
        );
    }

    getLessonsByDateRange(startDate: string, endDate: string): Observable<Lesson[]> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);

        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/search`, {params}).pipe(
            map((response) => response.data as Lesson[])
        );
    }

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
        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/search`, {params}).pipe(
            map((response) => response.data as Lesson[])
        );
    }

    // Student bookings endpoints
    getStudentBookings(
        studentId: string,
        filters?: { startDate?: string; endDate?: string; status?: string }
    ): Observable<StudentBooking[]> {
        let params = new HttpParams();
        if (filters?.startDate) params = params.set('startDate', filters.startDate);
        if (filters?.endDate) params = params.set('endDate', filters.endDate);
        if (filters?.status && filters.status !== 'ALL') params = params.set('status', filters.status);
        return this.http.get<ApiResponse<StudentBooking[]>>(`${this.apiUrl}/students/${studentId}/bookings`, {params}).pipe(
            map((response) => response.data as StudentBooking[])
        );
    }

    getStudentBookingsToday(studentId: string): Observable<StudentBooking[]> {
        return this.http.get<ApiResponse<StudentBooking[]>>(`${this.apiUrl}/students/${studentId}/bookings/today`).pipe(
            map((response) => response.data as StudentBooking[])
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

    // Get available lessons for a specific student
    getAvailableLessonsForStudent(studentId: string, startDate?: string, endDate?: string): Observable<Lesson[]> {
        let params = new HttpParams();
        params = params.set('startDate', startDate ?? '1900-01-01T00:00:00.000Z');
        params = params.set('endDate', endDate ?? '2100-01-01T00:00:00.000Z');
        return this.http.get<ApiResponse<Lesson[]>>(`${this.apiUrl}/students/${studentId}/available`, {params}).pipe(
            map((response) => response.data as Lesson[])
        );
    }
}
