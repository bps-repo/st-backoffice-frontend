import { Center } from "../corporate/center";
import { Student } from "./student";
import { LessonStatus } from "../../enums/lesson-status";
import { Attendance } from "./attendance";
import { Material } from "./material";
import { Class } from "./class";
import { LessonTeacher } from "./lesson-teacher";
import { LessonUnit } from "./lesson-unit";
import { LessonCenter } from "./lesson-center";

export interface Lesson {
    id?: string;
    title: string;
    description: string;
    online: boolean;
    onlineLink?: string;
    startDatetime: string | Date;
    endDatetime: string | Date;
    status: LessonStatus | string;
    materialsIds?: string[] | null;
    assessmentIds?: string[] | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;

    // New API structure with nested objects
    teacher: LessonTeacher;
    unit: LessonUnit;
    center: LessonCenter;

    // Legacy fields for backward compatibility
    level?: string;
    students?: any[];
    classEntity?: Class;
    student?: Student[];
    attendances?: Attendance[];
    materials?: Material[];
}


export interface LessonCreate {
    id?: string;
    title: string;
    description: string;
    online: boolean;
    onlineLink?: string;
    startDatetime: string | Date;
    endDatetime: string | Date;
    status: LessonStatus | string;
    materialsIds?: string[] | null;
    assessmentIds?: string[] | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;

    // New API structure with nested objects
    teacherId: string;
    unitId: string;
    centerId: string;

    // Legacy fields for backward compatibility
    level?: string;
    students?: any[];
    classEntity?: Class;
    student?: Student[];
    attendances?: Attendance[];
    materials?: Material[];
}
