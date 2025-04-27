import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { ClassesApiService } from '../../../services/classes-api.service';
import { classesActions } from '../actions/classes.actions';

@Injectable()
export class ClassesEffects {
  private actions$ = inject(Actions);
  private classesService = inject(ClassesApiService);

  loadClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(classesActions.loadClasses),
      exhaustMap(() =>
        this.classesService.getClasses().pipe(
          map((classes) => classesActions.loadClassesSuccess({ classes })),
          catchError((error) =>
            of(classesActions.loadClassesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(classesActions.loadClass),
      exhaustMap(({ id }) =>
        this.classesService.getClass(id).pipe(
          map((classItem) => classesActions.loadClassSuccess({ class: classItem })),
          catchError((error) =>
            of(classesActions.loadClassFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(classesActions.createClass),
      exhaustMap(({ class: classData }) =>
        this.classesService.createClass(classData).pipe(
          map((classItem) => classesActions.createClassSuccess({ class: classItem })),
          catchError((error) =>
            of(classesActions.createClassFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(classesActions.updateClass),
      exhaustMap(({ class: classData }) =>
        this.classesService.updateClass(classData).pipe(
          map((classItem) => classesActions.updateClassSuccess({ class: classItem })),
          catchError((error) =>
            of(classesActions.updateClassFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(classesActions.deleteClass),
      exhaustMap(({ id }) =>
        this.classesService.deleteClass(id).pipe(
          map(() => classesActions.deleteClassSuccess({ id })),
          catchError((error) =>
            of(classesActions.deleteClassFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
