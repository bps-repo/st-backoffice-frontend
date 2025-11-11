import { createSelector } from '@ngrx/store';
import { statisticsFeature } from './statistics.feature';
import { shouldRefreshCache } from './statisticsState';

// Basic selectors from feature
export const {
  selectStatisticsState,
  selectLoading,
  selectLoadingStudentStatistics,
  selectError,
  selectStudentStatisticsError,
  selectGeneralStatistics,
  selectStudentStatistics,
  selectLastFetch,
  selectCacheExpired
} = statisticsFeature;

// Dashboard statistics selectors
export const selectLoadingDashboardStatistics = createSelector(
  selectStatisticsState,
  (state) => state.loadingDashboardStatistics
);

export const selectDashboardStatisticsError = createSelector(
  selectStatisticsState,
  (state) => state.dashboardStatisticsError
);

export const selectDashboardStatistics = createSelector(
  selectStatisticsState,
  (state) => state.dashboardStatistics
);

// Get student statistics by ID
export const selectStudentStatisticsById = (studentId: string) => createSelector(
  selectStudentStatistics,
  (studentStatistics) => studentStatistics[studentId] || null
);

// Error selectors
export const selectAnyError = createSelector(
  selectError,
  selectStudentStatisticsError,
  (error, studentStatisticsError) => error || studentStatisticsError
);

// Loading selectors
export const selectAnyLoading = createSelector(
  selectLoading,
  selectLoadingStudentStatistics,
  (loading, loadingStudentStatistics) => loading || loadingStudentStatistics
);

// Cache selectors
export const selectShouldRefreshCache = createSelector(
  selectStatisticsState,
  (state) => shouldRefreshCache(state)
);

// Derived statistics selectors
export const selectTotalStudents = createSelector(
  selectGeneralStatistics,
  (statistics) => statistics?.totalStudents || 0
);

export const selectTotalClasses = createSelector(
  selectGeneralStatistics,
  (statistics) => statistics?.totalClasses || 0
);

export const selectTotalLessons = createSelector(
  selectGeneralStatistics,
  (statistics) => statistics?.totalLessons || 0
);

export const selectTotalAttendance = createSelector(
  selectGeneralStatistics,
  (statistics) => statistics?.totalAttendance || 0
);

export const selectAttendanceRate = createSelector(
  selectGeneralStatistics,
  (statistics) => statistics?.attendanceRate || 0
);

// Student-specific statistics selectors
export const selectStudentAttendanceRate = (studentId: string) => createSelector(
  selectStudentStatisticsById(studentId),
  (statistics) => statistics?.attendanceRate || 0
);

export const selectStudentCompletedLessons = (studentId: string) => createSelector(
  selectStudentStatisticsById(studentId),
  (statistics) => statistics?.completedLessons || 0
);

export const selectStudentTotalBookings = (studentId: string) => createSelector(
  selectStudentStatisticsById(studentId),
  (statistics) => statistics?.totalBookings || 0
);

export const selectStudentProgress = (studentId: string) => createSelector(
  selectStudentStatisticsById(studentId),
  (statistics) => statistics?.progress || 0
);
