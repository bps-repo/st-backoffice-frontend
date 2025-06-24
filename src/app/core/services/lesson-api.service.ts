import {HttpClient} from '@angular/common/http';
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
        return of()
    }

    createLesson(lessonData: Lesson): Observable<Lesson> {
        return of();
    }

    updateLesson(lessonData: Lesson): Observable<Lesson> {
        return of();
    }

    deleteLesson(id: string): Observable<void> {
        return of()
    }
}
