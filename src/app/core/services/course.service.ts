import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { PATH_TO_MOCK_DATA } from 'src/app/shared/constants/app';

@Injectable({
    providedIn: 'root',
})
export class CourseService extends BaseService<number, Course> {
    constructor(httpClient: HttpClient) {
        super(httpClient, PATH_TO_MOCK_DATA + 'courses.json');
    }

    getCourses(): Observable<Course[]> {
        return this.getAll();
    }

    getCourse(id: number): Observable<Course> {
        return this.getById(id);
    }
}
