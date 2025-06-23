import {createFeature, createReducer, on} from '@ngrx/store';
import {LESSONS_FEATURE_KEY, lessonsActions} from './lessons.actions';
import {lessonsAdapter, lessonsInitialState} from "./lessons.state";

// Create feature
export const lessonsFeature = createFeature({
    name: LESSONS_FEATURE_KEY,
    reducer: createReducer(
        lessonsInitialState,
        // Load lessons
        on(lessonsActions.loadLessons, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(lessonsActions.loadLessonsSuccess, (state, {lessons}) =>
            lessonsAdapter.setAll(lessons, {
                ...state,
                loading: false,
            })
        ),
        on(lessonsActions.loadLessonFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Load class
        on(lessonsActions.loadLessons, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(lessonsActions.loadLessonSuccess, (state, {lesson}) =>
            lessonsAdapter.upsertOne(lesson, {
                ...state,
                selectedLessonId: lesson.id!,
                loading: false,
            })
        ),
        on(lessonsActions.loadLessonFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Create class
        on(lessonsActions.createLesson, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(lessonsActions.createLessonSuccess, (state, {lesson: classItem}) =>
            lessonsAdapter.addOne(classItem, {
                ...state,
                loading: false,
            })
        ),
        on(lessonsActions.createLessonFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Update class
        on(lessonsActions.updateLesson, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(lessonsActions.updateLessonSuccess, (state, {lesson: lessonItem}) =>
            lessonsAdapter.updateOne(
                {id: lessonItem.id!, changes: lessonItem},
                {
                    ...state,
                    loading: false,
                }
            )
        ),
        on(lessonsActions.updateLessonFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Delete class
        on(lessonsActions.deleteLesson, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(lessonsActions.deleteLessonSuccess, (state, {id}) =>
            lessonsAdapter.removeOne(id, {
                ...state,
                selectedLessonId: state.selectedLessonId === id ? null : state.selectedLessonId,
                loading: false,
            })
        ),
        on(lessonsActions.deleteLessonFailure, (state, {error}) => ({
            ...state,
            loading: false,
            error,
        })),

        // Clear error
        on(lessonsActions.clearError, (state) => ({
            ...state,
            error: null,
        }))
    ),
});
