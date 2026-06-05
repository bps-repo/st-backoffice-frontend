import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  getDailyTaskById(taskId: string, centerId?: string): Observable<TaskItem> {
    return this.http.get<ApiResponse<TaskItem>>(`${this.apiUrl}/daily/${taskId}`).pipe(
      map(response => response.data),
      catchError(() => this.findTaskInDailyList(taskId, centerId)),
    );
  }

  private findTaskInDailyList(taskId: string, centerId?: string): Observable<TaskItem> {
    const statuses: TaskStatus[] = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'IGNORED', 'SNOOZED'];
    return forkJoin(
      statuses.map((status) =>
        this.getDailyTasks(status, centerId).pipe(catchError(() => of([] as TaskItem[]))),
      ),
    ).pipe(
      map((results) => {
        const task = results.flat().find((item) => item.id === taskId);
        if (!task) {
          throw new Error('Tarefa não encontrada.');
        }
        return task;
      }),
    );
  }

  runDailyTasks(centerId: string): Observable<void> {
    const params = new HttpParams().set('centerId', centerId);
    return this.http.post<void>(`${this.apiUrl}/daily/run`, null, { params });
  }

  applyTaskAction(
    taskId: string,
    action: TaskAction,
    options?: { resolvedBy?: string; date?: string; title?: string; description?: string }
  ): Observable<TaskItem> {
    const params = new HttpParams().set('action', action);
    const body: Record<string, unknown> = {};
    if (options?.resolvedBy)   body['resolvedBy']   = options.resolvedBy;
    if (options?.date)         body['date']         = options.date;
    if (options?.title)        body['title']        = options.title;
    if (options?.description)  body['description']  = options.description;
    return this.http.patch<ApiResponse<TaskItem>>(`${this.apiUrl}/daily/${taskId}/action`, body, { params }).pipe(
      map(response => response.data)
    );
  }
}
