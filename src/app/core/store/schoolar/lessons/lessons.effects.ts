import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {LessonApiService} from '../../../services/lesson-api.service';
import {lessonsActions} from "./lessons.actions";
import {HttpErrorResponse} from "@angular/common/module.d-CnjH8Dlt";

@Injectable()
export class LessonsEffects {
    private actions$ = inject(Actions);
    private lessonApiService = inject(LessonApiService);

    // Basic CRUD operations
    loadLessons$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadLessons),
            exhaustMap(() =>
                this.lessonApiService.getLessons().pipe(
                    map((lessons) => lessonsActions.loadLessonsSuccess({lessons})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.loadLessonsFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    loadLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadLesson),
            exhaustMap(({id}) =>
                this.lessonApiService.getLesson(id).pipe(
                    map((lesson) => lessonsActions.loadLessonSuccess({lesson})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.loadLessonFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    createLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.createLesson),
            exhaustMap(({lesson}) =>
                this.lessonApiService.createLesson(lesson).pipe(
                    map((createdLesson) => lessonsActions.createLessonSuccess({lesson: createdLesson})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.createLessonFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    updateLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.updateLesson),
            exhaustMap(({lesson}) =>
                this.lessonApiService.updateLesson(lesson).pipe(
                    map((updatedLesson) => lessonsActions.updateLessonSuccess({lesson: updatedLesson})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.updateLessonFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    deleteLesson$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.deleteLesson),
            exhaustMap(({id}) =>
                this.lessonApiService.deleteLesson(id).pipe(
                    map(() => lessonsActions.deleteLessonSuccess({id})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.deleteLessonFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    // Filter endpoints
    loadLessonsByClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadLessonsByClass),
            exhaustMap(({classId}) =>
                this.lessonApiService.getLessonsByClass(classId).pipe(
                    map((lessons) => lessonsActions.loadLessonsByClassSuccess({lessons})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.loadLessonsByClassFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    loadAvailableLessonsByClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadAvailableLessonsByClass),
            exhaustMap(({classId}) =>
                this.lessonApiService.getAvailableLessonsByClass(classId).pipe(
                    map((lessons) => lessonsActions.loadAvailableLessonsByClassSuccess({lessons})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.loadAvailableLessonsByClassFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    loadLessonsByCenter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadLessonsByCenter),
            exhaustMap(({centerId}) =>
                this.lessonApiService.getLessonsByCenter(centerId).pipe(
                    map((lessons) => lessonsActions.loadLessonsByCenterSuccess({lessons})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.loadLessonsByCenterFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    loadLessonsByDateRange$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadLessonsByDateRange),
            exhaustMap(({startDate, endDate}) =>
                this.lessonApiService.getLessonsByDateRange(startDate, endDate).pipe(
                    map((lessons) => lessonsActions.loadLessonsByDateRangeSuccess({lessons})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.loadLessonsByDateRangeFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    // Student bookings endpoints
    loadStudentBookings$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadStudentBookings),
            exhaustMap(({studentId}) =>
                this.lessonApiService.getStudentBookings(studentId).pipe(
                    map((bookings) => lessonsActions.loadStudentBookingsSuccess({bookings})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.loadStudentBookingsFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    loadStudentBookingsToday$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadStudentBookingsToday),
            exhaustMap(({studentId}) =>
                this.lessonApiService.getStudentBookingsToday(studentId).pipe(
                    map((bookings) => lessonsActions.loadStudentBookingsTodaySuccess({bookings})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.loadStudentBookingsTodayFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    // Lesson bookings endpoints
    loadLessonBookings$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadLessonBookings),
            exhaustMap(({lessonId}) =>
                this.lessonApiService.getLessonBookings(lessonId).pipe(
                    map((bookings) => lessonsActions.loadLessonBookingsSuccess({bookings})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.loadLessonBookingsFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    createLessonBooking$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.createLessonBooking),
            exhaustMap(({lessonId, bookingData}) =>
                this.lessonApiService.createLessonBooking(lessonId, bookingData).pipe(
                    map((booking) => lessonsActions.createLessonBookingSuccess({booking})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.createLessonBookingFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    deleteLessonBooking$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.deleteLessonBooking),
            exhaustMap(({lessonId, bookingId}) =>
                this.lessonApiService.deleteLessonBooking(lessonId, bookingId).pipe(
                    map(() => lessonsActions.deleteLessonBookingSuccess({lessonId, bookingId})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.deleteLessonBookingFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    // Lesson management endpoints
    updateLessonSchedule$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.updateLessonSchedule),
            exhaustMap(({lessonId, scheduleData}) =>
                this.lessonApiService.updateLessonSchedule(lessonId, scheduleData).pipe(
                    map((lesson) => lessonsActions.updateLessonScheduleSuccess({lesson})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.updateLessonScheduleFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    updateLessonOnlineStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.updateLessonOnlineStatus),
            exhaustMap(({lessonId, onlineStatus}) =>
                this.lessonApiService.updateLessonOnlineStatus(lessonId, onlineStatus).pipe(
                    map((lesson) => lessonsActions.updateLessonOnlineStatusSuccess({lesson})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.updateLessonOnlineStatusFailure({error: error.error.message}))
                    )
                )
            )
        )
    );

    markLessonsOverdue$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.markLessonsOverdue),
            exhaustMap(() =>
                this.lessonApiService.markLessonsOverdue().pipe(
                    map((response) => lessonsActions.markLessonsOverdueSuccess({response})),
                    catchError((error: HttpErrorResponse) =>
                        of(lessonsActions.markLessonsOverdueFailure({error: error.error.message}))
                    )
                )
            )
        )
    );
}
