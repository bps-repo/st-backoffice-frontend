import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ScholarStatisticsService } from 'src/app/core/services/scholar-statistics.service';
import { StatisticsActions } from './statistics.actions';

@Injectable()
export class StatisticsEffects {
  constructor(private actions$: Actions, private statisticsService: ScholarStatisticsService) {}

  loadStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.loadStatistics),
      mergeMap(() =>
        this.statisticsService.getStatistics().pipe(
          map((statistics) => StatisticsActions.loadStatisticsSuccess({ statistics })),
          catchError((error) => of(StatisticsActions.loadStatisticsFailure({ error: error.message })))
        )
      )
    )
  );

  loadStudentStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.loadStudentStatistics),
      mergeMap(({ studentId }) =>
        this.statisticsService.getStudentStatistics(studentId).pipe(
          map((statistics) => StatisticsActions.loadStudentStatisticsSuccess({ studentId, statistics })),
          catchError((error) => of(StatisticsActions.loadStudentStatisticsFailure({ error: error.message })))
        )
      )
    )
  );

  loadDashboardStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.loadDashboardStatistics),
      mergeMap(() =>
        this.statisticsService.getDashboardStatistics().pipe(
          map((dashboardStatistics) => StatisticsActions.loadDashboardStatisticsSuccess({ dashboardStatistics })),
          catchError((error) => of(StatisticsActions.loadDashboardStatisticsFailure({ error: error.message || 'Failed to load dashboard statistics' })))
        )
      )
    )
  );

  loadLessonsDashboardStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.loadLessonsDashboardStatistics),
      mergeMap(() =>
        this.statisticsService.getLessonsDashboardStatistics().pipe(
          map((lessonsDashboardStatistics) => StatisticsActions.loadLessonsDashboardStatisticsSuccess({ lessonsDashboardStatistics })),
          catchError((error) => of(StatisticsActions.loadLessonsDashboardStatisticsFailure({ error: error.message || 'Failed to load lessons dashboard statistics' })))
        )
      )
    )
  );
}
