import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lesson } from '../models/lesson';
import { BaseService } from './base.service';
import { map, Observable } from 'rxjs';
import { PATH_TO_MOCK_DATA } from 'src/app/shared/constants/app';

@Injectable({ providedIn: 'root' })
export class LessonService extends BaseService<string, Lesson> {
    constructor(httpClient: HttpClient) {
        super(httpClient, PATH_TO_MOCK_DATA + 'lessons.json');
    }

    getLessons(): Observable<Lesson[]> {
        return this.getAll();
    }
}
