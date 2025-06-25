import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { StudentHistoryService } from 'src/app/core/services/student-history.service';
import { StudentHistoriesActions } from './studentHistories.actions';

@Injectable()
export class StudentHistoriesEffects {
  constructor(private actions$: Actions, private studentHistoryService: StudentHistoryService) {}

  loadStudentHistories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentHistoriesActions.loadStudentHistories),
      mergeMap(() =>
        this.studentHistoryService.getStudentHistories().pipe(
          map((studentHistories) => StudentHistoriesActions.loadStudentHistoriesSuccess({ studentHistories })),
          catchError((error) => of(StudentHistoriesActions.loadStudentHistoriesFailure({ error: error.message })))
        )
      )
    )
  );

  createStudentHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentHistoriesActions.createStudentHistory),
      mergeMap(({ studentHistory }) =>
        this.studentHistoryService.createStudentHistory(studentHistory).pipe(
          map((studentHistory) => StudentHistoriesActions.createStudentHistorySuccess({ studentHistory })),
          catchError((error) => of(StudentHistoriesActions.createStudentHistoryFailure({ error: error.message })))
        )
      )
    )
  );

  loadStudentHistoriesByEventType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentHistoriesActions.loadStudentHistoriesByEventType),
      mergeMap(({ eventType }) =>
        this.studentHistoryService.getStudentHistoriesByEventType(eventType).pipe(
          map((studentHistories) => StudentHistoriesActions.loadStudentHistoriesByEventTypeSuccess({ studentHistories, eventType })),
          catchError((error) => of(StudentHistoriesActions.loadStudentHistoriesByEventTypeFailure({ error: error.message })))
        )
      )
    )
  );

  loadStudentHistoriesByDateRange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentHistoriesActions.loadStudentHistoriesByDateRange),
      mergeMap(({ startDate, endDate }) =>
        this.studentHistoryService.getStudentHistoriesByDateRange(startDate, endDate).pipe(
          map((studentHistories) => StudentHistoriesActions.loadStudentHistoriesByDateRangeSuccess({ studentHistories })),
          catchError((error) => of(StudentHistoriesActions.loadStudentHistoriesByDateRangeFailure({ error: error.message })))
        )
      )
    )
  );
}
