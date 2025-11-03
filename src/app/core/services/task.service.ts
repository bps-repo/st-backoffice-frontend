import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';
import { TaskItem } from '../models/task-item.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getDailyTasks(): Observable<TaskItem[]> {
    return this.http.get<ApiResponse<TaskItem[]>>(`${this.apiUrl}/daily`).pipe(
      map(response => response.data as TaskItem[])
    );
  }
}

