import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Student } from 'src/app/core/models/academic/student';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getStudents() {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudent(id: number) {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: Student) {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(student: Student) {
    return this.http.put<Student>(`${this.apiUrl}/${student.id}`, student);
  }

  deleteStudent(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
