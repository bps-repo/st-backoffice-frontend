import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Student } from 'src/app/core/models/academic/student';
import { Permission } from '../models/auth/permission';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${student.id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Student permissions management
  getStudentPermissions(studentId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/${studentId}/permissions`);
  }

  addPermissionToStudent(studentId: number, permissionId: number): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/${studentId}/permissions`, { permissionId });
  }

  removePermissionFromStudent(studentId: number, permissionId: number): Observable<Student> {
    return this.http.delete<Student>(`${this.apiUrl}/${studentId}/permissions/${permissionId}`);
  }
}
