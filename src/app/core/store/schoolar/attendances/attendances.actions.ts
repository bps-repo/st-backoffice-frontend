import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Attendance } from 'src/app/core/models/academic/attendance';
import { AttendanceStatusUpdate } from 'src/app/core/models/academic/attendance-update';

export const ATTENDANCES_FEATURE_KEY = 'attendances';

export const attendancesActions = createActionGroup({
    source: ATTENDANCES_FEATURE_KEY,
    events: {
        // Load attendances
        'Load Attendances': emptyProps(),
        'Load Attendances Success': props<{ attendances: Attendance[] }>(),
        'Load Attendances Failure': props<{ error: string }>(),

        // Load attendances by lesson
        'Load Attendances By Lesson': props<{ lessonId: string }>(),
        'Load Attendances By Lesson Success': props<{ attendances: Attendance[] }>(),
        'Load Attendances By Lesson Failure': props<{ error: string }>(),

        // Load attendances by student
        'Load Attendances By Student': props<{ studentId: string }>(),
        'Load Attendances By Student Success': props<{ attendances: Attendance[] }>(),
        'Load Attendances By Student Failure': props<{ error: string }>(),

        // Load single attendance
        'Load Attendance': props<{ id: string }>(),
        'Load Attendance Success': props<{ attendance: Attendance }>(),
        'Load Attendance Failure': props<{ error: string }>(),

        // Create attendance
        'Create Attendance': props<{ attendance: Partial<Attendance> }>(),
        'Create Attendance Success': props<{ attendance: Attendance }>(),
        'Create Attendance Failure': props<{ error: string }>(),

        // Update attendance status
        'Update Attendance Status': props<{ id: string, statusUpdate: AttendanceStatusUpdate }>(),
        'Update Attendance Status Success': props<{ attendance: Attendance }>(),
        'Update Attendance Status Failure': props<{ error: string }>(),

        // Update attendance
        'Update Attendance': props<{ attendance: Attendance }>(),
        'Update Attendance Success': props<{ attendance: Attendance }>(),
        'Update Attendance Failure': props<{ error: string }>(),

        // Delete attendance
        'Delete Attendance': props<{ id: string }>(),
        'Delete Attendance Success': props<{ id: string }>(),
        'Delete Attendance Failure': props<{ error: string }>(),

        // Clear error
        'Clear Error': emptyProps(),
    },
});
