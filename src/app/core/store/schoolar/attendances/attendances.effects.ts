import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AttendanceService } from 'src/app/core/services/attendance.service';
import { attendancesActions } from './attendances.actions';

@Injectable()
export class AttendancesEffects {
    constructor(
        private actions$: Actions,
        private attendanceService: AttendanceService
    ) {}

    // Load all attendances
    loadAttendances$ = createEffect(() =>
        this.actions$.pipe(
            ofType(attendancesActions.loadAttendances),
            switchMap(() =>
                this.attendanceService.getAttendances().pipe(
                    map((attendances) =>
                        attendancesActions.loadAttendancesSuccess({ attendances })
                    ),
                    catchError((error) =>
                        of(attendancesActions.loadAttendancesFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Load attendances by lesson
    loadAttendancesByLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(attendancesActions.loadAttendancesByLesson),
            switchMap(({ lessonId }) =>
                this.attendanceService.getAttendancesByLessonId(lessonId).pipe(
                    map((attendances) =>
                        attendancesActions.loadAttendancesByLessonSuccess({ attendances })
                    ),
                    catchError((error) =>
                        of(attendancesActions.loadAttendancesByLessonFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Load attendances by student
    loadAttendancesByStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(attendancesActions.loadAttendancesByStudent),
            switchMap(({ studentId }) =>
                this.attendanceService.getAttendancesByStudent(studentId).pipe(
                    map((attendances) =>
                        attendancesActions.loadAttendancesByStudentSuccess({ attendances })
                    ),
                    catchError((error) =>
                        of(attendancesActions.loadAttendancesByStudentFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Load single attendance
    loadAttendance$ = createEffect(() =>
        this.actions$.pipe(
            ofType(attendancesActions.loadAttendance),
            switchMap(({ id }) =>
                this.attendanceService.getAttendanceById(id).pipe(
                    map((attendance) =>
                        attendancesActions.loadAttendanceSuccess({ attendance })
                    ),
                    catchError((error) =>
                        of(attendancesActions.loadAttendanceFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Create attendance
    createAttendance$ = createEffect(() =>
        this.actions$.pipe(
            ofType(attendancesActions.createAttendance),
            switchMap(({ attendance }) =>
                this.attendanceService.createAttendance(attendance).pipe(
                    map((createdAttendance) =>
                        attendancesActions.createAttendanceSuccess({ attendance: createdAttendance })
                    ),
                    catchError((error) =>
                        of(attendancesActions.createAttendanceFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Update attendance status
    updateAttendanceStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(attendancesActions.updateAttendanceStatus),
            switchMap(({ id, statusUpdate }) =>
                this.attendanceService.updateAttendanceStatus(id, statusUpdate).pipe(
                    map((updatedAttendance) =>
                        attendancesActions.updateAttendanceStatusSuccess({ attendance: updatedAttendance })
                    ),
                    catchError((error) =>
                        of(attendancesActions.updateAttendanceStatusFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Update attendance
    updateAttendance$ = createEffect(() =>
        this.actions$.pipe(
            ofType(attendancesActions.updateAttendance),
            switchMap(({ attendance }) =>
                this.attendanceService.updateAttendance(attendance.id, attendance).pipe(
                    map((updatedAttendance) =>
                        attendancesActions.updateAttendanceSuccess({ attendance: updatedAttendance })
                    ),
                    catchError((error) =>
                        of(attendancesActions.updateAttendanceFailure({ error: error.message }))
                    )
                )
            )
        )
    );

    // Delete attendance
    deleteAttendance$ = createEffect(() =>
        this.actions$.pipe(
            ofType(attendancesActions.deleteAttendance),
            switchMap(({ id }) =>
                this.attendanceService.deleteAttendance(id).pipe(
                    map(() =>
                        attendancesActions.deleteAttendanceSuccess({ id })
                    ),
                    catchError((error) =>
                        of(attendancesActions.deleteAttendanceFailure({ error: error.message }))
                    )
                )
            )
        )
    );
}
