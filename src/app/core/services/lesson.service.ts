import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lesson } from '../models/lesson';
import { BaseService } from './base.service';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LessonService extends BaseService<string, Lesson> {
    constructor(httpClient: HttpClient) {
        super(httpClient, 'assets/mock-data/lessons.json');
    }

    getLessons(): Observable<Lesson[]> {
        return this.getAll();
    }
}
