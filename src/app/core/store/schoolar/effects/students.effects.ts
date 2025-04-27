import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { StudentsService } from '../../../../features/schoolar/features/students/services/students.service';
import { studentsActions } from '../actions/students.actions';

@Injectable()
export class StudentsEffects {
  private actions$ = inject(Actions);
  private studentsService = inject(StudentsService);

  loadStudents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(studentsActions.loadStudents),
      exhaustMap(() =>
        this.studentsService.getStudents().pipe(
          map((students) => studentsActions.loadStudentsSuccess({ students })),
          catchError((error) =>
            of(studentsActions.loadStudentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadStudent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(studentsActions.loadStudent),
      exhaustMap(({ id }) =>
        this.studentsService.getStudent(id).pipe(
          map((student) => studentsActions.loadStudentSuccess({ student })),
          catchError((error) =>
            of(studentsActions.loadStudentFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createStudent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(studentsActions.createStudent),
      exhaustMap(({ student }) =>
        this.studentsService.createStudent(student).pipe(
          map((student) => studentsActions.createStudentSuccess({ student })),
          catchError((error) =>
            of(studentsActions.createStudentFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateStudent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(studentsActions.updateStudent),
      exhaustMap(({ student }) =>
        this.studentsService.updateStudent(student).pipe(
          map((student) => studentsActions.updateStudentSuccess({ student })),
          catchError((error) =>
            of(studentsActions.updateStudentFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteStudent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(studentsActions.deleteStudent),
      exhaustMap(({ id }) =>
        this.studentsService.deleteStudent(id).pipe(
          map(() => studentsActions.deleteStudentSuccess({ id })),
          catchError((error) =>
            of(studentsActions.deleteStudentFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
