import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AttendancesState } from './attendances.state';
import { ATTENDANCES_FEATURE_KEY } from './attendances.actions';

export const selectAttendancesState = createFeatureSelector<AttendancesState>(ATTENDANCES_FEATURE_KEY);

export const selectAllAttendances = createSelector(
    selectAttendancesState,
    (state: AttendancesState) => state.attendances
);

export const selectSelectedAttendance = createSelector(
    selectAttendancesState,
    (state: AttendancesState) => state.selectedAttendance
);

export const selectAttendancesLoading = createSelector(
    selectAttendancesState,
    (state: AttendancesState) => state.loading
);

export const selectAttendancesError = createSelector(
    selectAttendancesState,
    (state: AttendancesState) => state.error
);

export const selectAttendancesByLesson = (lessonId: string) => createSelector(
    selectAllAttendances,
    (attendances) => attendances.filter(attendance => attendance.lessonId === lessonId)
);

export const selectAttendancesByStudent = (studentId: string) => createSelector(
    selectAllAttendances,
    (attendances) => attendances.filter(attendance => attendance.studentId === studentId)
);

export const selectAttendanceById = (id: string) => createSelector(
    selectAllAttendances,
    (attendances) => attendances.find(attendance => attendance.id === id)
);
