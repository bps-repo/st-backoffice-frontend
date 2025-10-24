import { createFeature, createReducer, on } from '@ngrx/store';
import { ATTENDANCES_FEATURE_KEY, attendancesActions } from './attendances.actions';
import { initialAttendancesState } from './attendances.state';

// Create feature
export const attendancesFeature = createFeature({
    name: ATTENDANCES_FEATURE_KEY,
    reducer: createReducer(
        initialAttendancesState,

        // Load attendances
        on(attendancesActions.loadAttendances, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(attendancesActions.loadAttendancesSuccess, (state, { attendances }) => ({
            ...state,
            attendances,
            loading: false,
            error: null,
        })),
        on(attendancesActions.loadAttendancesFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        // Load attendances by lesson
        on(attendancesActions.loadAttendancesByLesson, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(attendancesActions.loadAttendancesByLessonSuccess, (state, { attendances }) => ({
            ...state,
            attendances,
            loading: false,
            error: null,
        })),
        on(attendancesActions.loadAttendancesByLessonFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        // Load attendances by student
        on(attendancesActions.loadAttendancesByStudent, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(attendancesActions.loadAttendancesByStudentSuccess, (state, { attendances }) => ({
            ...state,
            attendances,
            loading: false,
            error: null,
        })),
        on(attendancesActions.loadAttendancesByStudentFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        // Load single attendance
        on(attendancesActions.loadAttendance, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(attendancesActions.loadAttendanceSuccess, (state, { attendance }) => ({
            ...state,
            selectedAttendance: attendance,
            loading: false,
            error: null,
        })),
        on(attendancesActions.loadAttendanceFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        // Create attendance
        on(attendancesActions.createAttendance, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(attendancesActions.createAttendanceSuccess, (state, { attendance }) => ({
            ...state,
            attendances: [...state.attendances, attendance],
            loading: false,
            error: null,
        })),
        on(attendancesActions.createAttendanceFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        // Update attendance status
        on(attendancesActions.updateAttendanceStatus, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(attendancesActions.updateAttendanceStatusSuccess, (state, { attendance }) => ({
            ...state,
            attendances: state.attendances.map(att =>
                att.id === attendance.id ? attendance : att
            ),
            selectedAttendance: state.selectedAttendance?.id === attendance.id ? attendance : state.selectedAttendance,
            loading: false,
            error: null,
        })),
        on(attendancesActions.updateAttendanceStatusFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        // Update attendance
        on(attendancesActions.updateAttendance, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(attendancesActions.updateAttendanceSuccess, (state, { attendance }) => ({
            ...state,
            attendances: state.attendances.map(att =>
                att.id === attendance.id ? attendance : att
            ),
            selectedAttendance: state.selectedAttendance?.id === attendance.id ? attendance : state.selectedAttendance,
            loading: false,
            error: null,
        })),
        on(attendancesActions.updateAttendanceFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        // Delete attendance
        on(attendancesActions.deleteAttendance, (state) => ({
            ...state,
            loading: true,
            error: null,
        })),
        on(attendancesActions.deleteAttendanceSuccess, (state, { id }) => ({
            ...state,
            attendances: state.attendances.filter(att => att.id !== id),
            selectedAttendance: state.selectedAttendance?.id === id ? null : state.selectedAttendance,
            loading: false,
            error: null,
        })),
        on(attendancesActions.deleteAttendanceFailure, (state, { error }) => ({
            ...state,
            loading: false,
            error,
        })),

        // Clear error
        on(attendancesActions.clearError, (state) => ({
            ...state,
            error: null,
        })),
    ),
});
