import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {StudentHistory, EventType} from 'src/app/core/models/academic/student-history';

export const STUDENT_HISTORY_FEATURE_KEY = 'studentHistories';

export const StudentHistoriesActions = createActionGroup({
    source: STUDENT_HISTORY_FEATURE_KEY,
    events: {
        // Load student histories
        'Load Student Histories': emptyProps(),
        'Load Student Histories Success': props<{ studentHistories: StudentHistory[] }>(),
        'Load Student Histories Failure': props<{ error: string }>(),

        // Create student history
        'Create Student History': props<{ studentHistory: Partial<StudentHistory> }>(),
        'Create Student History Success': props<{ studentHistory: StudentHistory }>(),
        'Create Student History Failure': props<{ error: string }>(),

        // Get student histories by event type
        'Load Student Histories By Event Type': props<{ eventType: EventType }>(),
        'Load Student Histories By Event Type Success': props<{ studentHistories: StudentHistory[], eventType: EventType }>(),
        'Load Student Histories By Event Type Failure': props<{ error: string }>(),

        // Get student histories by date range
        'Load Student Histories By Date Range': props<{ startDate: string, endDate: string }>(),
        'Load Student Histories By Date Range Success': props<{ studentHistories: StudentHistory[] }>(),
        'Load Student Histories By Date Range Failure': props<{ error: string }>(),

        // Select student history
        'Select Student History': props<{ id: string }>(),
        'Clear Selected Student History': emptyProps(),

        // Cache management
        'Set Last Fetch': props<{ timestamp: number }>(),
        'Set Cache Expired': props<{ expired: boolean }>(),
        'Refresh Cache': emptyProps(),
        'Clear Cache': emptyProps(),

        // Clear errors
        'Clear Error': props<{ errorType: string }>(),
        'Clear All Errors': emptyProps(),
    },
});
