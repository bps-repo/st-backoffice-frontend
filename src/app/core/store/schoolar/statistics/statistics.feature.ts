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
      lastFetch: null,
      cacheExpired: false,
    })),

    // Clear errors
    on(StatisticsActions.clearError, (state, { errorType }) => {
      const updates: any = {};

      if (errorType === 'general' || !errorType) updates.error = null;
      if (errorType === 'student' || !errorType) updates.studentStatisticsError = null;

      return { ...state, ...updates };
    }),
    on(StatisticsActions.clearAllErrors, (state) => ({
      ...state,
      error: null,
      studentStatisticsError: null,
    }))
  ),
});

export const { name, reducer, selectStatisticsState } = statisticsFeature;
