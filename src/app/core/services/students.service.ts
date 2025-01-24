import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Student } from '../models/student';
import { Observable } from 'rxjs';
import { PATH_TO_MOCK_DATA } from 'src/app/shared/constants/app';

@Injectable({ providedIn: 'root' })
export class StudentService extends BaseService<number, Student> {
    constructor(httpClient: HttpClient) {
        super(httpClient, PATH_TO_MOCK_DATA + 'student.json');
    }

    getStudents(): Observable<Student[]> {
        return this.getAll();
    }

    getStudentById(id: number): Observable<Student> {
        return this.getById(id);
    }
}
