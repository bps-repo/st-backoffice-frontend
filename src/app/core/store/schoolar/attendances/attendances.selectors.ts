import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AttendancesState } from './attendances.state';
import { ATTENDANCES_FEATURE_KEY } from './attendances.actions';

export const selectAttendancesState = createFeatureSelector<AttendancesState>(ATTENDANCES_FEATURE_KEY);

export const selectAllAttendances = createSelector(
    selectAttendancesState,
    (state) => state.attendances
);

export const selectSelectedAttendance = createSelector(
    selectAttendancesState,
    (state) => state.selectedAttendance
);

export const selectAttendancesLoading = createSelector(
    selectAttendancesState,
    (state) => state.loading
);

export const selectAttendancesError = createSelector(
    selectAttendancesState,
    (state) => state.error
);

/** Returns attendances for a specific lesson from the scoped cache. */
export const selectAttendancesByLesson = (lessonId: string) => createSelector(
    selectAttendancesState,
    (state) => state.byLessonId[lessonId] ?? []
);

/** Returns attendances for a specific student from the scoped cache. */
export const selectAttendancesByStudent = (studentId: string) => createSelector(
    selectAttendancesState,
    (state) => state.byStudentId[studentId] ?? []
);

export const selectAttendanceById = (id: string) => createSelector(
    selectAllAttendances,
    (attendances) => attendances.find((a) => a.id === id)
);
