import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Student } from '../models/student';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService extends BaseService<number, Student> {
    constructor(httpClient: HttpClient) {
        super(httpClient, 'assets/mock-data/student.json');
    }

    getStudents(): Observable<Student[]> {
        return this.getAll();
    }

    getStudentById(id: number): Observable<Student> {
        return this.getById(id);
    }
}
