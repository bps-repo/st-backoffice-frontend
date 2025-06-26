import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Assessment } from './assessmentState';

export const ASSESSMENT_FEATURE_KEY = 'assessments';

export const AssessmentActions = createActionGroup({
  source: ASSESSMENT_FEATURE_KEY,
  events: {
    // Get unit assessments
    'Load Unit Assessments': props<{ unitId: string }>(),
    'Load Unit Assessments Success': props<{ unitId: string, assessments: Assessment[] }>(),
    'Load Unit Assessments Failure': props<{ error: string }>(),

    // Cache management
    'Set Last Fetch': props<{ timestamp: number }>(),
    'Set Cache Expired': props<{ expired: boolean }>(),
    'Refresh Cache': emptyProps(),
    'Clear Cache': emptyProps(),

    // Clear errors
    'Clear Error': emptyProps(),
  },
});
