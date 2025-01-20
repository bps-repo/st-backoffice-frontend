import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lesson } from '../models/lesson';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LessonService {
    baseUrl = 'assets/mock-data/lessons.json';
    constructor(private httpClient: HttpClient) {}

    getLessons(): Observable<Lesson[]> {
        return this.httpClient
            .get<{ data: Lesson[] }>(this.baseUrl)
            .pipe(map((response) => response.data));
    }
}
