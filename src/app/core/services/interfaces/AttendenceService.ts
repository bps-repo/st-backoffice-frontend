import {Attendance} from "../../models/academic/attendance";

export interface AttendanceService {
    createAttendance(
        lessonId: string,
        studentId: string,
        present: boolean,
        justification: string
    ): Promise<Attendance>;

    findByLessonId(lessonId: string): Promise<Attendance[]>;

    findByStudentId(studentId: string): Promise<Attendance[]>;

    findByLessonIdAndStudentId(lessonId: string, studentId: string): Promise<Attendance[]>;

    findByPresent(present: boolean): Promise<Attendance[]>;

    updateAttendanceStatus(
        attendanceId: string,
        present: boolean,
        justification: string
    ): Promise<Attendance>;

    getAttendanceRateForStudent(studentId: string): Promise<number>;

    getAttendanceRateForLesson(lessonId: string): Promise<number>;

    getAttendanceRateForStudentInClass(studentId: string, classId: string): Promise<number>;

    createAttendancesForLesson(lessonId: string, present: boolean): Promise<number>;
}
