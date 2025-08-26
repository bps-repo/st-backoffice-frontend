import {Center} from "../corporate/center";
import {Student} from "./student";
import {LessonStatus} from "../../enums/lesson-status";
import {Attendance} from "./attendance";
import {Material} from "./material";
import {Class} from "./class";

export interface Lesson {
    id?: string;
    title: string;
    description: string;
    online: boolean;
    onlineLink?: string;
    teacherId?: string;
    startDatetime: string | Date;
    endDatetime: string | Date;
    unitId?: string;
    centerId?: string;
    status: LessonStatus | string;
    materialsIds?: string[] | null;
    assessmentIds?: string[] | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    // Legacy fields for backward compatibility
    teacher?: string;
    level?: string;
    unit?: string;
    students?: any[];
    center?: Center | string;
    classEntity?: Class;
    student?: Student[];
    attendances?: Attendance[];
    materials?: Material[];
}
