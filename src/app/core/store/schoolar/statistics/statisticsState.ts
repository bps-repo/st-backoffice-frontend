import { EntityState, createEntityAdapter } from '@ngrx/entity';

// Since statistics don't have a clear entity structure, we'll use a simple state interface
export interface StatisticsState {
  // Loading states
  loading: boolean;
  loadingStudentStatistics: boolean;

  // Error states
  error: string | null;
  studentStatisticsError: string | null;

  // Data
  generalStatistics: any | null;
  studentStatistics: { [studentId: string]: any };

  // Cache management
  lastFetch: number | null;
  cacheExpired: boolean;
}

export const statisticsInitialState: StatisticsState = {
  // Loading states
  loading: false,
  loadingStudentStatistics: false,

  // Error states
  error: null,
  studentStatisticsError: null,

  // Data
  generalStatistics: null,
  studentStatistics: {},

  // Cache management
  lastFetch: null,
  cacheExpired: false
};

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const isCacheValid = (lastFetch: number | null): boolean => {
  if (!lastFetch) return false;
  return Date.now() - lastFetch < CACHE_DURATION;
};

export const shouldRefreshCache = (state: StatisticsState): boolean => {
  return !state.lastFetch || state.cacheExpired || !isCacheValid(state.lastFetch);
};
