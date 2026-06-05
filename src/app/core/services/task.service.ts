import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';
import { TaskAction, TaskItem, TaskStatus } from '../models/task-item.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/tasks`;

  getDailyTasks(status: TaskStatus = 'OPEN', centerId?: string): Observable<TaskItem[]> {
    let params = new HttpParams().set('status', status);
    if (centerId) {
      params = params.set('centerId', centerId);
    }
    return this.http.get<ApiResponse<TaskItem[]>>(`${this.apiUrl}/daily`, { params }).pipe(
      map(response => response.data)
    );
  }

  runDailyTasks(centerId: string): Observable<void> {
    const params = new HttpParams().set('centerId', centerId);
    return this.http.post<void>(`${this.apiUrl}/daily/run`, null, { params });
  }

  applyTaskAction(taskId: string, action: TaskAction, resolvedBy?: string): Observable<TaskItem> {
    const body: { action: TaskAction; resolvedBy?: string } = { action };
    if (resolvedBy) {
      body.resolvedBy = resolvedBy;
    }
    return this.http.patch<ApiResponse<TaskItem>>(`${this.apiUrl}/daily/${taskId}/action`, body).pipe(
      map(response => response.data)
    );
  }
}
