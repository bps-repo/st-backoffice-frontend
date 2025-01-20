import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Student } from '../models/student';

@Injectable({ providedIn: 'root' })
export class StudentService extends BaseService<Student> {
    constructor(httpClient: HttpClient) {
        super(httpClient, 'assets/mock-data/student.json');
    }

    getStudents() {
        return this.getAll();
    }

    getStudentById(id: number) {
        return this.getById(id);
    }
}
