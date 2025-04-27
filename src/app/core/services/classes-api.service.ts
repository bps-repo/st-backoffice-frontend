import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Class } from 'src/app/core/models/academic/class';

@Injectable({
  providedIn: 'root',
})
export class ClassesApiService {
  private apiUrl = `${environment.apiUrl}/classes`;

  constructor(private http: HttpClient) {}

  getClasses() {
    return this.http.get<Class[]>(this.apiUrl);
  }

  getClass(id: string) {
    return this.http.get<Class>(`${this.apiUrl}/${id}`);
  }

  createClass(classData: Class) {
    return this.http.post<Class>(this.apiUrl, classData);
  }

  updateClass(classData: Class) {
    return this.http.put<Class>(`${this.apiUrl}/${classData.id}`, classData);
  }

  deleteClass(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
