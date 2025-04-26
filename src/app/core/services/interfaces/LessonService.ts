import {Lesson} from "../../models/academic/lesson";
import {Attendance} from "../../models/academic/attendance";

class LessonStatus {
}

export interface LessonService {
    createLesson(
        classId: string,
        startDatetime: Date,
        endDatetime: Date,
        title: string,
        description: string,
        teacherId: number,
        online: boolean,
        onlineLink: string,
        status: LessonStatus
    ): Promise<Lesson>;

    findByClassId(classId: string): Promise<Lesson[]>;

    findByTeacherId(teacherId: number): Promise<Lesson[]>;

    findByStatus(status: LessonStatus): Promise<Lesson[]>;

    findByDateRange(
        startDate: Date,
        endDate: Date
    ): Promise<Lesson[]>;

    updateLessonStatus(lessonId: string, status: LessonStatus): Promise<Lesson>;

    updateLessonOnlineStatus(
        lessonId: string,
        online: boolean,
        onlineLink: string
    ): Promise<Lesson>;

    updateLessonDateTime(
        lessonId: string,
        startDatetime: Date,
        endDatetime: Date
    ): Promise<Lesson>;

    getAttendancesForLesson(lessonId: string): Promise<Set<Attendance>>;

    addAttendanceToLesson(
        lessonId: string,
        attendance: Attendance
    ): Promise<Lesson>;

    removeAttendanceFromLesson(
        lessonId: string,
        attendanceId: string
    ): Promise<Lesson>;
}
