import { Attendance } from 'src/app/core/models/academic/attendance';

export interface AttendancesState {
    /** Global flat list — populated by loadAttendances (all) */
    attendances: Attendance[];
    /** Per-lesson scoped cache: lessonId → Attendance[] */
    byLessonId: Record<string, Attendance[]>;
    /** Per-student scoped cache: studentId → Attendance[] */
    byStudentId: Record<string, Attendance[]>;
    selectedAttendance: Attendance | null;
    loading: boolean;
    error: string | null;
}

export const initialAttendancesState: AttendancesState = {
    attendances: [],
    byLessonId: {},
    byStudentId: {},
    selectedAttendance: null,
    loading: false,
    error: null,
};
