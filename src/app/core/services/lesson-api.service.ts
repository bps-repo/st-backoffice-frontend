import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Class } from 'src/app/core/models/academic/class';
import {Lesson} from "../models/academic/lesson";

@Injectable({
  providedIn: 'root',
})
export class LessonApiService {
  private apiUrl = `${environment.apiUrl}/lessons`;

  constructor(private http: HttpClient) {}

  getLessons() {
    return this.http.get<Lesson[]>(this.apiUrl);
  }

  getLesson(id: string) {
    return this.http.get<Lesson>(`${this.apiUrl}/${id}`);
  }

  createLesson(lessonData: Lesson) {
    return this.http.post<Lesson>(this.apiUrl, lessonData);
  }

  updateLesson(lessonData: Lesson) {
    return this.http.put<Lesson>(`${this.apiUrl}/${lessonData.id}`, lessonData);
  }

  deleteLesson(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
