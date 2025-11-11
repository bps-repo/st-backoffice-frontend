import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const STATISTICS_FEATURE_KEY = 'statistics';

export const StatisticsActions = createActionGroup({
  source: STATISTICS_FEATURE_KEY,
  events: {
    // Load general statistics
    'Load Statistics': emptyProps(),
    'Load Statistics Success': props<{ statistics: any }>(),
    'Load Statistics Failure': props<{ error: string }>(),

    // Load student statistics
    'Load Student Statistics': props<{ studentId: string }>(),
    'Load Student Statistics Success': props<{ studentId: string, statistics: any }>(),
    'Load Student Statistics Failure': props<{ error: string }>(),

    // Load dashboard statistics
    'Load Dashboard Statistics': emptyProps(),
    'Load Dashboard Statistics Success': props<{ dashboardStatistics: any }>(),
    'Load Dashboard Statistics Failure': props<{ error: string }>(),

    // Load lessons dashboard statistics
    'Load Lessons Dashboard Statistics': emptyProps(),
    'Load Lessons Dashboard Statistics Success': props<{ lessonsDashboardStatistics: any }>(),
    'Load Lessons Dashboard Statistics Failure': props<{ error: string }>(),

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
