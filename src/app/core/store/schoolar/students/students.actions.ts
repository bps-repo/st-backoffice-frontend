import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Student} from 'src/app/core/models/academic/student';
import {Update} from "@ngrx/entity";

export const STUDENT_FEATURE_KEY = 'students';

export const StudentsActions = createActionGroup({
    source: STUDENT_FEATURE_KEY,
    events: {
        // Load students
        'Load Students': emptyProps(),
        'Load Students Success': props<{ students: Student[] }>(),
        'Load Students Failure': props<{ error: string }>(),

        // Load student
        'Load Student': props<{ id: string }>(),
        'Load Student Success': props<{ student: Student }>(),
        'Load Student Failure': props<{ error: string }>(),

        // Create student
        'Create Student': props<{ student: Student }>(),
        'Create Student Success': props<{ student: Student }>(),
        'Create Student Failure': props<{ error: string }>(),

        // Update student
        'Update Student': props<{ student: Student }>(),
        'Update Student Success': props<{ student: Student }>(),
        'Update Student Failure': props<{ error: string }>(),

        // Delete student
        'Delete Student': props<{ id: string }>(),
        'Delete Student Success': props<{ id: string }>(),
        'Delete Student Failure': props<{ error: string }>(),

        // Clear error
        'Clear Error': emptyProps(),
    },
});
