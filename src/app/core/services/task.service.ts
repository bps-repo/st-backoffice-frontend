import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';
import {
  DailyTasksFilter,
  DailyTasksPage,
  TaskAction,
  TaskItem,
  TaskStatus,
} from '../models/task-item.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/tasks`;

  getDailyTasks(filter: DailyTasksFilter = {}): Observable<DailyTasksPage> {
    let params = new HttpParams()
      .set('page', String(filter.page ?? 0))
      .set('size', String(filter.size ?? 50));

    if (filter.status) {
      params = params.set('status', filter.status);
    }
    if (filter.centerId) {
      params = params.set('centerId', filter.centerId);
    }
    if (filter.taskType) {
      params = params.set('taskType', filter.taskType);
    }

    return this.http.get<ApiResponse<DailyTasksPage>>(`${this.apiUrl}/daily`, { params }).pipe(
      map((response) => response.data),
    );
  }

  getDailyTaskById(taskId: string, centerId?: string): Observable<TaskItem> {
    return this.http.get<ApiResponse<TaskItem>>(`${this.apiUrl}/daily/${taskId}`).pipe(
      map((response) => response.data),
      catchError(() => this.findTaskInDailyList(taskId, centerId)),
    );
  }

  private findTaskInDailyList(taskId: string, centerId?: string): Observable<TaskItem> {
    const statuses: TaskStatus[] = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'IGNORED', 'SNOOZED'];
    return forkJoin(
      statuses.map((status) =>
        this.getDailyTasks({ status, centerId, page: 0, size: 1000 }).pipe(
          map((page) => page.items),
          catchError(() => of([] as TaskItem[])),
        ),
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
      map((response) => response.data),
    );
  }
}
