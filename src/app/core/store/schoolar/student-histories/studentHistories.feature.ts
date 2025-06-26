import { createFeature, createReducer, on } from '@ngrx/store';
import { STUDENT_HISTORY_FEATURE_KEY, StudentHistoriesActions } from './studentHistories.actions';
import { studentHistoriesAdapter, studentHistoriesInitialState } from './studentHistoryState';

export const studentHistoriesFeature = createFeature({
  name: STUDENT_HISTORY_FEATURE_KEY,
  reducer: createReducer(
    studentHistoriesInitialState,

    // Load student histories
    on(StudentHistoriesActions.loadStudentHistories, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(StudentHistoriesActions.loadStudentHistoriesSuccess, (state, { studentHistories }) =>
      studentHistoriesAdapter.setAll(studentHistories, {
        ...state,
        loading: false,
        error: null,
        lastFetch: Date.now(),
        cacheExpired: false,
      })
    ),
    on(StudentHistoriesActions.loadStudentHistoriesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Create student history
    on(StudentHistoriesActions.createStudentHistory, (state) => ({
      ...state,
      loadingCreate: true,
      createError: null,
    })),
    on(StudentHistoriesActions.createStudentHistorySuccess, (state, { studentHistory }) =>
      studentHistoriesAdapter.addOne(studentHistory, {
        ...state,
        loadingCreate: false,
        createError: null,
      })
    ),
    on(StudentHistoriesActions.createStudentHistoryFailure, (state, { error }) => ({
      ...state,
      loadingCreate: false,
      createError: error,
    })),

    // Load student histories by event type
    on(StudentHistoriesActions.loadStudentHistoriesByEventType, (state) => ({
      ...state,
      loadingByEventType: true,
      byEventTypeError: null,
    })),
    on(StudentHistoriesActions.loadStudentHistoriesByEventTypeSuccess, (state, { studentHistories, eventType }) => ({
      ...state,
      studentHistoriesByEventType: {
        ...state.studentHistoriesByEventType,
        [eventType]: studentHistories,
      },
      loadingByEventType: false,
      byEventTypeError: null,
    })),
    on(StudentHistoriesActions.loadStudentHistoriesByEventTypeFailure, (state, { error }) => ({
      ...state,
      loadingByEventType: false,
      byEventTypeError: error,
    })),

    // Load student histories by date range
    on(StudentHistoriesActions.loadStudentHistoriesByDateRange, (state) => ({
      ...state,
      loadingByDateRange: true,
      byDateRangeError: null,
    })),
    on(StudentHistoriesActions.loadStudentHistoriesByDateRangeSuccess, (state, { studentHistories }) => ({
      ...state,
      studentHistoriesByDateRange: studentHistories,
      loadingByDateRange: false,
      byDateRangeError: null,
    })),
    on(StudentHistoriesActions.loadStudentHistoriesByDateRangeFailure, (state, { error }) => ({
      ...state,
      loadingByDateRange: false,
      byDateRangeError: error,
    })),

    // Select student history
    on(StudentHistoriesActions.selectStudentHistory, (state, { id }) => ({
      ...state,
      selectedStudentHistoryId: id,
    })),
    on(StudentHistoriesActions.clearSelectedStudentHistory, (state) => ({
      ...state,
      selectedStudentHistoryId: null,
    })),

    // Cache management
    on(StudentHistoriesActions.setLastFetch, (state, { timestamp }) => ({
      ...state,
      lastFetch: timestamp,
    })),
    on(StudentHistoriesActions.setCacheExpired, (state, { expired }) => ({
      ...state,
      cacheExpired: expired,
    })),
    on(StudentHistoriesActions.refreshCache, (state) => ({
      ...state,
      cacheExpired: true,
    })),
    on(StudentHistoriesActions.clearCache, (state) =>
      studentHistoriesAdapter.removeAll({
        ...state,
        lastFetch: null,
        cacheExpired: false,
      })
    ),

    // Clear errors
    on(StudentHistoriesActions.clearError, (state, { errorType }) => {
      const updates: any = {};

      if (errorType === 'general' || !errorType) updates.error = null;
      if (errorType === 'create' || !errorType) updates.createError = null;
      if (errorType === 'byEventType' || !errorType) updates.byEventTypeError = null;
      if (errorType === 'byDateRange' || !errorType) updates.byDateRangeError = null;

      return { ...state, ...updates };
    }),
    on(StudentHistoriesActions.clearAllErrors, (state) => ({
      ...state,
      error: null,
      createError: null,
      byEventTypeError: null,
      byDateRangeError: null,
    }))
  ),
});

export const { name, reducer, selectStudentHistoriesState } = studentHistoriesFeature;
