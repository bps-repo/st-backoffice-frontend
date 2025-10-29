import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TaskService } from '../../../services/task.service';
import { TasksActions } from './tasks.actions';

@Injectable()
export class TasksEffects {
  constructor(
    private actions$: Actions,
    private taskService: TaskService
  ) {}

  loadDailyTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadDailyTasks),
      switchMap(() =>
        this.taskService.getDailyTasks().pipe(
          map((tasks) => TasksActions.loadDailyTasksSuccess({ tasks })),
          catchError((error) => of(TasksActions.loadDailyTasksFailure({ error })))
        )
      )
    )
  );
}

