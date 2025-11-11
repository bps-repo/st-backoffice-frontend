import { createFeature, createReducer, on } from '@ngrx/store';
import { STATISTICS_FEATURE_KEY, StatisticsActions } from './statistics.actions';
import { statisticsInitialState } from './statisticsState';

export const statisticsFeature = createFeature({
  name: STATISTICS_FEATURE_KEY,
  reducer: createReducer(
    statisticsInitialState,

    // Load general statistics
    on(StatisticsActions.loadStatistics, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(StatisticsActions.loadStatisticsSuccess, (state, { statistics }) => ({
      ...state,
      generalStatistics: statistics,
      loading: false,
      error: null,
      lastFetch: Date.now(),
      cacheExpired: false,
    })),
    on(StatisticsActions.loadStatisticsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Load student statistics
    on(StatisticsActions.loadStudentStatistics, (state) => ({
      ...state,
      loadingStudentStatistics: true,
      studentStatisticsError: null,
    })),
    on(StatisticsActions.loadStudentStatisticsSuccess, (state, { studentId, statistics }) => ({
      ...state,
      studentStatistics: {
        ...state.studentStatistics,
        [studentId]: statistics,
      },
      loadingStudentStatistics: false,
      studentStatisticsError: null,
    })),
    on(StatisticsActions.loadStudentStatisticsFailure, (state, { error }) => ({
      ...state,
      loadingStudentStatistics: false,
      studentStatisticsError: error,
    })),

    // Load dashboard statistics
    on(StatisticsActions.loadDashboardStatistics, (state) => ({
      ...state,
      loadingDashboardStatistics: true,
      dashboardStatisticsError: null,
    })),
    on(StatisticsActions.loadDashboardStatisticsSuccess, (state, { dashboardStatistics }) => ({
      ...state,
      dashboardStatistics,
      loadingDashboardStatistics: false,
      dashboardStatisticsError: null,
      lastFetch: Date.now(),
      cacheExpired: false,
    })),
    on(StatisticsActions.loadDashboardStatisticsFailure, (state, { error }) => ({
      ...state,
      loadingDashboardStatistics: false,
      dashboardStatisticsError: error,
    })),

    // Load lessons dashboard statistics
    on(StatisticsActions.loadLessonsDashboardStatistics, (state) => ({
      ...state,
      loadingLessonsDashboardStatistics: true,
      lessonsDashboardStatisticsError: null,
    })),
    on(StatisticsActions.loadLessonsDashboardStatisticsSuccess, (state, { lessonsDashboardStatistics }) => ({
      ...state,
      lessonsDashboardStatistics,
      loadingLessonsDashboardStatistics: false,
      lessonsDashboardStatisticsError: null,
      lastFetch: Date.now(),
      cacheExpired: false,
    })),
    on(StatisticsActions.loadLessonsDashboardStatisticsFailure, (state, { error }) => ({
      ...state,
      loadingLessonsDashboardStatistics: false,
      lessonsDashboardStatisticsError: error,
    })),

    // Cache management
    on(StatisticsActions.setLastFetch, (state, { timestamp }) => ({
      ...state,
      lastFetch: timestamp,
    })),
    on(StatisticsActions.setCacheExpired, (state, { expired }) => ({
      ...state,
      cacheExpired: expired,
    })),
    on(StatisticsActions.refreshCache, (state) => ({
      ...state,
      cacheExpired: true,
    })),
    on(StatisticsActions.clearCache, (state) => ({
      ...state,
      generalStatistics: null,
      studentStatistics: {},
      dashboardStatistics: null,
      lessonsDashboardStatistics: null,
      lastFetch: null,
      cacheExpired: false,
    })),

    // Clear errors
    on(StatisticsActions.clearError, (state, { errorType }) => {
      const updates: any = {};

      if (errorType === 'general' || !errorType) updates.error = null;
      if (errorType === 'student' || !errorType) updates.studentStatisticsError = null;
      if (errorType === 'dashboard' || !errorType) updates.dashboardStatisticsError = null;
      if (errorType === 'lessonsDashboard' || !errorType) updates.lessonsDashboardStatisticsError = null;

      return { ...state, ...updates };
    }),
    on(StatisticsActions.clearAllErrors, (state) => ({
      ...state,
      error: null,
      studentStatisticsError: null,
      dashboardStatisticsError: null,
      lessonsDashboardStatisticsError: null,
    }))
  ),
});

export const { name, reducer, selectStatisticsState } = statisticsFeature;
