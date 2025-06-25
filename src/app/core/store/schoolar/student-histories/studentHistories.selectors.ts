import { createSelector } from '@ngrx/store';
import { studentHistoriesFeature } from './studentHistories.feature';
import { studentHistoriesAdapter } from './studentHistoryState';
import { EventType } from '../../../models/academic/student-history';

// Basic selectors from feature
export const {
  selectStudentHistoriesState,
  selectLoading,
  selectLoadingCreate,
  selectLoadingByEventType,
  selectLoadingByDateRange,
  selectError,
  selectCreateError,
  selectByEventTypeError,
  selectByDateRangeError,
  selectSelectedStudentHistoryId,
  selectStudentHistoriesByEventType,
  selectStudentHistoriesByDateRange,
  selectLastFetch,
  selectCacheExpired
} = studentHistoriesFeature;

// Entity adapter selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = studentHistoriesAdapter.getSelectors(studentHistoriesFeature.selectStudentHistoriesState);

// Basic entity selectors
export const selectAllStudentHistories = selectAll;
export const selectStudentHistoryEntities = selectEntities;
export const selectStudentHistoryIds = selectIds;
export const selectTotalStudentHistories = selectTotal;

// Selected student history selector
export const selectSelectedStudentHistory = createSelector(
  selectStudentHistoryEntities,
  selectSelectedStudentHistoryId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

// Get student history by ID
export const selectStudentHistoryById = (id: string) => createSelector(
  selectStudentHistoryEntities,
  (entities) => entities[id] || null
);

// Get student histories by event type
export const selectStudentHistoriesByEventTypeValue = (eventType: EventType) => createSelector(
  selectStudentHistoriesByEventType,
  (historiesByEventType) => historiesByEventType[eventType] || []
);

// Error selectors
export const selectAnyError = createSelector(
  selectError,
  selectCreateError,
  selectByEventTypeError,
  selectByDateRangeError,
  (error, createError, byEventTypeError, byDateRangeError) =>
    error || createError || byEventTypeError || byDateRangeError
);

// Loading selectors
export const selectAnyLoading = createSelector(
  selectLoading,
  selectLoadingCreate,
  selectLoadingByEventType,
  selectLoadingByDateRange,
  (loading, loadingCreate, loadingByEventType, loadingByDateRange) =>
    loading || loadingCreate || loadingByEventType || loadingByDateRange
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

// Filtered selectors
export const selectStudentHistoriesByStudentId = (studentId: string) => createSelector(
  selectAllStudentHistories,
  (histories) => histories.filter(history => history.student.id === studentId)
);

export const selectRecentStudentHistories = createSelector(
  selectAllStudentHistories,
  (histories) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    return histories.filter(history => new Date(history.eventDate) >= thirtyDaysAgo);
  }
);

export const selectStudentHistoriesSortedByDate = createSelector(
  selectAllStudentHistories,
  (histories) => [...histories].sort((a, b) =>
    new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  )
);
