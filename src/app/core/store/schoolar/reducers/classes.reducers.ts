import {createFeature, createReducer, on} from '@ngrx/store';
import {ClassesState} from '../app.state';
import {lessonsActions} from '../actions/lessons.actions';
import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';
import {Class} from 'src/app/core/models/academic/class';
import {Lesson} from "../../../models/academic/lesson";

// Create entity adapter
export const lessonsAdapter: EntityAdapter<Lesson> = createEntityAdapter<Lesson>({
    selectId: (classItem: Lesson) => classItem.id!,
});

// Initial state
export const lessonsInitialState: ClassesState = lessonsAdapter.getInitialState({
    selectedLessonId: null,
    loading: false,
    error: null,
});

// Create feature
export const classesFeature = createFeature({
    name: 'lessons',
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
