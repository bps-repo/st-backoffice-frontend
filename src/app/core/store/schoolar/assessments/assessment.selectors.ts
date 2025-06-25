import { createSelector } from '@ngrx/store';
import { assessmentFeature } from './assessment.feature';
import { assessmentsAdapter } from './assessmentState';
import { Assessment } from './assessmentState';

// Basic selectors from feature
export const {
  selectAssessmentState,
  selectLoading,
  selectError,
  selectLastFetch,
  selectCacheExpired,
  selectAssessmentsByUnit
} = assessmentFeature;

// Entity adapter selectors
const {
  selectEntities,
  selectAll,
  selectIds,
  selectTotal
} = assessmentsAdapter.getSelectors(assessmentFeature.selectAssessmentState);

// Basic entity selectors
export const selectAllAssessments = createSelector(
  selectAll,
  (assessments) => assessments
);

export const selectAssessmentEntities = createSelector(
  selectEntities,
  (entities) => entities
);

export const selectAssessmentIds = selectIds;

export const selectTotalAssessments = selectTotal;

// Get assessment by ID
export const selectAssessmentById = (id: string) => createSelector(
  selectAssessmentEntities,
  (entities) => entities[id] || null
);

// Get assessments by unit ID
export const selectAssessmentsByUnitId = (unitId: string) => createSelector(
  selectAssessmentsByUnit,
  (assessmentsByUnit) => assessmentsByUnit[unitId] || []
);

// Error selectors
export const selectAnyError = createSelector(
  selectError,
  (error) => error
);

// Loading selectors
export const selectAnyLoading = createSelector(
  selectLoading,
  (loading) => loading
);

// Cache selectors
export const selectShouldRefreshCache = createSelector(
  selectLastFetch,
  selectCacheExpired,
  (lastFetch, cacheExpired) => {
    if (cacheExpired) return true;
    if (!lastFetch) return true;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    return Date.now() - lastFetch > CACHE_DURATION;
  }
);
