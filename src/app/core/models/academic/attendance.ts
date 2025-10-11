import { AttendanceStatus } from "../../enums/attendance-status";
import {Lesson} from "./lesson";
import {Student} from "./student";

export interface Attendance {
    id: string;
    lessonId: string;
    lessonTitle: string;
    lessonStartDatetime: string;
    studentId: string;
    studentName: string;
    status: AttendanceStatus;
    present: boolean;
    justification: string;
    className?: string;
    createdAt: string;
    updatedAt: string;
    // Optional nested objects for backward compatibility
    lesson?: Lesson;
    student?: Student;
}
