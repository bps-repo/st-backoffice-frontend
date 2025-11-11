import { EntityState, createEntityAdapter } from '@ngrx/entity';

// Since statistics don't have a clear entity structure, we'll use a simple state interface
export interface StatisticsState {
  // Loading states
  loading: boolean;
  loadingStudentStatistics: boolean;
  loadingDashboardStatistics: boolean;
  loadingLessonsDashboardStatistics: boolean;

  // Error states
  error: string | null;
  studentStatisticsError: string | null;
  dashboardStatisticsError: string | null;
  lessonsDashboardStatisticsError: string | null;

  // Data
  generalStatistics: any | null;
  studentStatistics: { [studentId: string]: any };
  dashboardStatistics: any | null;
  lessonsDashboardStatistics: any | null;

  // Cache management
  lastFetch: number | null;
  cacheExpired: boolean;
}

export const statisticsInitialState: StatisticsState = {
  // Loading states
  loading: false,
  loadingStudentStatistics: false,
  loadingDashboardStatistics: false,
  loadingLessonsDashboardStatistics: false,

  // Error states
  error: null,
  studentStatisticsError: null,
  dashboardStatisticsError: null,
  lessonsDashboardStatisticsError: null,

  // Data
  generalStatistics: null,
  studentStatistics: {},
  dashboardStatistics: null,
  lessonsDashboardStatistics: null,

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
