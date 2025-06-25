import { EntityState, createEntityAdapter } from '@ngrx/entity';

// Since we don't have a specific Assessment model, we'll use a generic type
export interface Assessment {
  id: string;
  [key: string]: any;
}

export interface AssessmentState extends EntityState<Assessment> {
  // Loading states
  loading: boolean;

  // Error states
  error: string | null;

  // Specialized data
  assessmentsByUnit: { [unitId: string]: Assessment[] };

  // Cache management
  lastFetch: number | null;
  cacheExpired: boolean;
}

export const assessmentsAdapter = createEntityAdapter<Assessment>({
  selectId: (assessment: Assessment) => assessment.id,
  sortComparer: false
});

export const assessmentInitialState: AssessmentState = assessmentsAdapter.getInitialState({
  // Loading states
  loading: false,

  // Error states
  error: null,

  // Specialized data
  assessmentsByUnit: {},

  // Cache management
  lastFetch: null,
  cacheExpired: false
});

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const isCacheValid = (lastFetch: number | null): boolean => {
  if (!lastFetch) return false;
  return Date.now() - lastFetch < CACHE_DURATION;
};

export const shouldRefreshCache = (state: AssessmentState): boolean => {
  return !state.lastFetch || state.cacheExpired || !isCacheValid(state.lastFetch);
};
