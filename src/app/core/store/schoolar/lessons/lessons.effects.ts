import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, exhaustMap, map} from 'rxjs/operators';
import {LessonApiService} from '../../../services/lesson-api.service';
import {lessonsActions} from "./lessons.actions";

@Injectable()
export class LessonsEffects {
    private actions$ = inject(Actions);
    private lessonApiService = inject(LessonApiService);

    loadLessons$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadLessons),
            exhaustMap(() =>
                this.lessonApiService.getLessons().pipe(
                    map((lessons) => lessonsActions.loadLessonsSuccess({lessons})),
                    catchError((error) =>
                        of(lessonsActions.loadLessonsFailure({error: error.message}))
                    )
                )
            )
        )
    );

    loadClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.loadLesson),
            exhaustMap(({id}) =>
                this.lessonApiService.getLesson(id).pipe(
                    map((classItem) => lessonsActions.loadLessonSuccess({lesson: classItem})),
                    catchError((error) =>
                        of(lessonsActions.loadLessonFailure({error: error.message}))
                    )
                )
            )
        )
    );

    createClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.createLesson),
            exhaustMap(({lesson: classData}) =>
                this.lessonApiService.createLesson(classData).pipe(
                    map((classItem) => lessonsActions.createLessonSuccess({lesson: classItem})),
                    catchError((error) =>
                        of(lessonsActions.createLessonFailure({error: error.message}))
                    )
                )
            )
        )
    );

    updateClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.updateLesson),
            exhaustMap(({lesson: classData}) =>
                this.lessonApiService.updateLesson(classData).pipe(
                    map((classItem) => lessonsActions.updateLessonSuccess({lesson: classItem})),
                    catchError((error) =>
                        of(lessonsActions.updateLessonFailure({error: error.message}))
                    )
                )
            )
        )
    );

    deleteClass$ = createEffect(() =>
        this.actions$.pipe(
            ofType(lessonsActions.deleteLesson),
            exhaustMap(({id}) =>
                this.lessonApiService.deleteLesson(id).pipe(
                    map(() => lessonsActions.deleteLessonSuccess({id})),
                    catchError((error) =>
                        of(lessonsActions.deleteLessonFailure({error: error.message}))
                    )
                )
            )
        )
    );
}
