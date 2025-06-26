import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Student} from 'src/app/core/models/academic/student';
import {ApiResponse, PageableResponse} from "./interfaces/ApiResponseService";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    private apiUrl = `${environment.apiUrl}/students`;

    constructor(private http: HttpClient) {
    }

    getStudents(): Observable<Student[]> {
        return this.http.get<ApiResponse<PageableResponse<Student[]>>>(this.apiUrl).pipe(
            map((response) => response.data.content as Student[])
        );
    }

    getStudent(id: string): Observable<Student> {
        return this.http.get<ApiResponse<Student>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data as Student)
        );
    }

    createStudent(student: Student): Observable<Student> {
        return this.http.post<ApiResponse<Student>>(this.apiUrl, student).pipe(
            map((response) => response.data as Student)
        );
    }

    updateStudent(student: Student): Observable<Student> {
        return this.http.put<ApiResponse<Student>>(`${this.apiUrl}/${student.id}`, student).pipe(
            map((response) => response.data as Student)
        );
    }

    deleteStudent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    createStudentPhoto(photoData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/photo/create`, photoData);
    }

    addStudentToClass(studentId: string, classId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add-to-class/${classId}`, {studentId});
    }

    removeStudentFromClass(studentId: string, classId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/remove-from-class/${classId}`, {studentId});
    }

    addStudentToCenter(studentId: string, centerId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/add-to-center/${centerId}`, {studentId});
    }

    removeStudentFromCenter(studentId: string, centerId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/remove-from-center/${centerId}`, {studentId});
    }
}
