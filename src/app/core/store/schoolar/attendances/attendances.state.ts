import { Attendance } from 'src/app/core/models/academic/attendance';

export interface AttendancesState {
    attendances: Attendance[];
    selectedAttendance: Attendance | null;
    loading: boolean;
    error: string | null;
}

export const initialAttendancesState: AttendancesState = {
    attendances: [],
    selectedAttendance: null,
    loading: false,
    error: null,
};
