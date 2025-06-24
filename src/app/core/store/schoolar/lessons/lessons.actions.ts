import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Lesson} from 'src/app/core/models/academic/lesson';

export const LESSONS_FEATURE_KEY = 'lessons';

export const lessonsActions = createActionGroup({
    source: LESSONS_FEATURE_KEY,
    events: {
        // Load lessons
        'Load lessons': emptyProps(),
        'Load lessons Success': props<{ lessons: Lesson[] }>(),
        'Load lessons Failure': props<{ error: string }>(),

        // Load Lesson
        'Load Lesson': props<{ id: string }>(),
        'Load Lesson Success': props<{ lesson: Lesson }>(),
        'Load Lesson Failure': props<{ error: string }>(),

        // Create Lesson
        'Create Lesson': props<{ lesson: Lesson }>(),
        'Create Lesson Success': props<{ lesson: Lesson }>(),
        'Create Lesson Failure': props<{ error: string }>(),

        // Update Lesson
        'Update Lesson': props<{ lesson: Lesson }>(),
        'Update Lesson Success': props<{ lesson: Lesson }>(),
        'Update Lesson Failure': props<{ error: string }>(),

        // Delete Lesson
        'Delete Lesson': props<{ id: string }>(),
        'Delete Lesson Success': props<{ id: string }>(),
        'Delete Lesson Failure': props<{ error: string }>(),

        // Clear error
        'Clear Error': emptyProps(),
    },
});
