import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Class} from 'src/app/core/models/academic/class';

export const CLASS_FEATURE_KEY = 'classes';

export const classesActions = createActionGroup(
    {
        source: CLASS_FEATURE_KEY,
        events: {
            // Load classes
            'Load classes': emptyProps(),
            'Load classes Success': props<{ classes: Class[] }>(),
            'Load classes Failure': props<{ error: string }>(),

            // Load class
            'Load class': props<{ id: string }>(),
            'Load class Success': props<{ classData: Class }>(),
            'Load class Failure': props<{ error: string }>(),

            // Create class
            'Create class': props<{ classData: Class }>(),
            'Create class Success': props<{ classData: Class }>(),
            'Create class Failure': props<{ error: string }>(),


            // Update class
            'Update class': props<{ id: string, changes: Partial<Class> }>(),
            'Update class Success': props<{ classData: Class }>(),
            'Update class Failure': props<{ error: string }>(),


            // Delete class
            'Delete class': props<{ id: string }>(),
            'Delete class Success': props<{ id: string }>(),
            'Delete class Failure': props<{ error: string }>(),

            // Clear error
            'Clear error': props<{ error: string }>(),
        },
    }
)
