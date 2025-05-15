import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ClassActions from '../actions/class.actions';
import { ClassService } from 'src/app/core/services/classes.service';
import { ApiResponse } from 'src/app/core/services/interfaces/ApiResponseService';
import { Class } from 'src/app/core/models/academic/class';

@Injectable()
export class ClassEffects {
  constructor(private actions$: Actions, private classService: ClassService) {}

  createClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.createClass),
      mergeMap(({ classData }) =>
        this.classService.createClass(classData).pipe(
          map((response: ApiResponse<Class>) =>
            ClassActions.createClassSuccess({ classData: response.data })
          ),
          catchError(error =>
            of(ClassActions.createClassFailure({ error }))
          )
        )
      )
    )
  );

  loadClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.loadClass),
      mergeMap(({ id }) =>
        this.classService.getClassById(id).pipe(
          map((response: ApiResponse<Class>) =>
            ClassActions.loadClassSuccess({ classData: response.data })
          ),
          catchError(error =>
            of(ClassActions.loadClassFailure({ error }))
          )
        )
      )
    )
  );

  loadPagedClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.loadPagedClasses),
      mergeMap(({ size }) =>
        this.classService.getPagedClasses(size).pipe(
          map((response: ApiResponse<{ content: Class[] }>) =>
            ClassActions.loadPagedClassesSuccess({ classes: response.data.content })
          ),
          catchError(error =>
            of(ClassActions.loadPagedClassesFailure({ error }))
          )
        )
      )
    )
  );

  deleteClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.deleteClass),
      mergeMap(({ id }) =>
        this.classService.deleteClass(id).pipe(
          map(() => ClassActions.deleteClassSuccess({ id })),
          catchError(error =>
            of(ClassActions.deleteClassFailure({ error }))
          )
        )
      )
    )
  );

  updateClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.updateClass),
      mergeMap(({ id, classData }) =>
        this.classService.updateClass(id, classData).pipe(
          map((response: ApiResponse<Class>) =>
            ClassActions.updateClassSuccess({ classData: response.data })
          ),
          catchError(error =>
            of(ClassActions.updateClassFailure({ error }))
          )
        )
      )
    )
  );
}
