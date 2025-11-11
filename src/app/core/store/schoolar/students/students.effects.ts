import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { StudentService } from '../../../services/student.service';
import { StudentsActions } from "./students.actions";
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class StudentsEffects {
    private actions$ = inject(Actions);
    private studentsService = inject(StudentService);

    loadStudents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.loadStudents),
            exhaustMap(() =>
                this.studentsService.getStudents().pipe(
                    map((students) => StudentsActions.loadStudentsSuccess({ students, pagination: null })),
                    catchError((error) =>
                        of(StudentsActions.loadStudentsFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    loadStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.loadStudent),
            exhaustMap(({ id }) =>
                this.studentsService.getStudent(id).pipe(
                    map((student) => StudentsActions.loadStudentSuccess({ student })),
                    catchError((error) =>
                        of(StudentsActions.loadStudentFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    searchStudents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.searchStudents),
            exhaustMap(({ filters }) =>
                this.studentsService.searchStudents(filters).pipe(
                    map((students) => StudentsActions.searchStudentsSuccess({ students })),
                    catchError((error) =>
                        of(StudentsActions.searchStudentsFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    createStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.createStudent),
            exhaustMap(({ student }) =>
                this.studentsService.createStudent(student).pipe(
                    map((student) => StudentsActions.createStudentSuccess({ student })),
                    catchError((error: HttpErrorResponse) => {
                        console.log(error);
                        return of(StudentsActions.createStudentFailure({ error: error.error.message }));
                    })
                )
            )
        )
    );

    createStudentWithRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.createStudentWithRequest),
            exhaustMap(({ request }) =>
                this.studentsService.createStudentWithRequest(request).pipe(
                    map((student) => StudentsActions.createStudentWithRequestSuccess({ student })),
                    catchError((error: HttpErrorResponse) => {
                        return of(StudentsActions.createStudentWithRequestFailure({ error: error.error.message }));
                    })
                )
            )
        )
    );


    updateStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.updateStudent),
            exhaustMap(({ student }) =>
                this.studentsService.updateStudent(student).pipe(
                    map((student) => StudentsActions.updateStudentSuccess({ student })),
                    catchError((error) =>
                        of(StudentsActions.updateStudentFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    deleteStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.deleteStudent),
            exhaustMap(({ id }) =>
                this.studentsService.deleteStudent(id).pipe(
                    map(() => StudentsActions.deleteStudentSuccess({ id })),
                    catchError((error) =>
                        of(StudentsActions.deleteStudentFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    createStudentPhoto$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.createStudentPhoto),
            exhaustMap(({ studentId, photoData }) =>
                this.studentsService.createStudentPhoto(photoData).pipe(
                    map((response) => StudentsActions.createStudentPhotoSuccess({ response })),
                    catchError((error) =>
                        of(StudentsActions.createStudentPhotoFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    addStudentToClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.addStudentToClass),
            exhaustMap(({ studentId, classId }) =>
                this.studentsService.addStudentToClass(studentId, classId).pipe(
                    map((response) => StudentsActions.addStudentToClassSuccess({ response })),
                    catchError((error) =>
                        of(StudentsActions.addStudentToClassFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    removeStudentFromClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.removeStudentFromClass),
            exhaustMap(({ studentId, classId }) =>
                this.studentsService.removeStudentFromClass(studentId, classId).pipe(
                    map((response) => StudentsActions.removeStudentFromClassSuccess({ response })),
                    catchError((error) =>
                        of(StudentsActions.removeStudentFromClassFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    addStudentToCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.addStudentToCenter),
            exhaustMap(({ studentId, centerId }) =>
                this.studentsService.addStudentToCenter(studentId, centerId).pipe(
                    map((response) => StudentsActions.addStudentToCenterSuccess({ response })),
                    catchError((error) =>
                        of(StudentsActions.addStudentToCenterFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    removeStudentFromCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.removeStudentFromCenter),
            exhaustMap(({ studentId, centerId }) =>
                this.studentsService.removeStudentFromCenter(studentId, centerId).pipe(
                    map((response) => StudentsActions.removeStudentFromCenterSuccess({ response })),
                    catchError((error) =>
                        of(StudentsActions.removeStudentFromCenterFailure({ error: error.message }))
                    )
                )
            )
        )
    );
}
