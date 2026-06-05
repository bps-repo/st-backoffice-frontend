import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TaskService } from '../../../services/task.service';
import { TasksActions } from './tasks.actions';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  loadDailyTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadDailyTasks),
      switchMap(() =>
        this.taskService.getDailyTasks().pipe(
          map((page) => TasksActions.loadDailyTasksSuccess({ tasks: page.items })),
          catchError((error) => of(TasksActions.loadDailyTasksFailure({ error })))
        )
      )
    )
  );

  runDailyTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.runDailyTasks),
      switchMap(({ centerId }) =>
        this.taskService.runDailyTasks(centerId).pipe(
          map(() => TasksActions.runDailyTasksSuccess()),
          catchError((error) => of(TasksActions.runDailyTasksFailure({ error })))
        )
      )
    )
  );

  applyTaskAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.applyTaskAction),
      switchMap(({ taskId, action, resolvedBy }) =>
        this.taskService.applyTaskAction(taskId, action, { resolvedBy }).pipe(
          map((task) => TasksActions.applyTaskActionSuccess({ task })),
          catchError((error) => of(TasksActions.applyTaskActionFailure({ error })))
        )
      )
    )
  );
}
