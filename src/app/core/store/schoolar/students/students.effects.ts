import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {StudentService} from '../../../services/student.service';
import {StudentsActions} from "./students.actions";

@Injectable()
export class StudentsEffects {
    private actions$ = inject(Actions);
    private studentsService = inject(StudentService);

    loadStudents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.loadStudents),
            exhaustMap(() =>
                this.studentsService.getStudents().pipe(
                    map((students) => StudentsActions.loadStudentsSuccess({students})),
                    catchError((error) =>
                        of(StudentsActions.loadStudentsFailure({error: error.message}))
                    )
                )
            )
        )
    );

    loadStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.loadStudent),
            exhaustMap(({id}) =>
                this.studentsService.getStudent(id).pipe(
                    map((student) => StudentsActions.loadStudentSuccess({student})),
                    catchError((error) =>
                        of(StudentsActions.loadStudentFailure({error: error.message}))
                    )
                )
            )
        )
    );

    createStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.createStudent),
            exhaustMap(({student}) =>
                this.studentsService.createStudent(student).pipe(
                    map((student) => StudentsActions.createStudentSuccess({student})),
                    catchError((error) =>
                        of(StudentsActions.createStudentFailure({error: error.message}))
                    )
                )
            )
        )
    );

    updateStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.updateStudent),
            exhaustMap(({student}) =>
                this.studentsService.updateStudent(student).pipe(
                    map((student) => StudentsActions.updateStudentSuccess({student})),
                    catchError((error) =>
                        of(StudentsActions.updateStudentFailure({error: error.message}))
                    )
                )
            )
        )
    );

    deleteStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(StudentsActions.deleteStudent),
            exhaustMap(({id}) =>
                this.studentsService.deleteStudent(id).pipe(
                    map(() => StudentsActions.deleteStudentSuccess({id})),
                    catchError((error) =>
                        of(StudentsActions.deleteStudentFailure({error: error.message}))
                    )
                )
            )
        )
    );
}
