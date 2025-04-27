import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Class } from 'src/app/core/models/academic/class';

export const classesActions = createActionGroup({
  source: 'Classes',
  events: {
    // Load classes
    'Load Classes': emptyProps(),
    'Load Classes Success': props<{ classes: Class[] }>(),
    'Load Classes Failure': props<{ error: string }>(),

    // Load class
    'Load Class': props<{ id: string }>(),
    'Load Class Success': props<{ class: Class }>(),
    'Load Class Failure': props<{ error: string }>(),

    // Create class
    'Create Class': props<{ class: Class }>(),
    'Create Class Success': props<{ class: Class }>(),
    'Create Class Failure': props<{ error: string }>(),

    // Update class
    'Update Class': props<{ class: Class }>(),
    'Update Class Success': props<{ class: Class }>(),
    'Update Class Failure': props<{ error: string }>(),

    // Delete class
    'Delete Class': props<{ id: string }>(),
    'Delete Class Success': props<{ id: string }>(),
    'Delete Class Failure': props<{ error: string }>(),

    // Clear error
    'Clear Error': emptyProps(),
  },
});
