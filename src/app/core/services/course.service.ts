import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CourseService extends BaseService<number, Course> {
    constructor(httpClient: HttpClient) {
        super(httpClient, 'assets/mock-data/courses.json');
    }

    getCourses(): Observable<Course[]> {
        return this.getAll();
    }

    getCourse(id: number): Observable<Course> {
        return this.getById(id);
    }
}
