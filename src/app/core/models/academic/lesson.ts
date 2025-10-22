import { Student } from "./student";
import { LessonStatus } from "../../enums/lesson-status";
import { Attendance } from "./attendance";
import { Material } from "./material";
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
    student?: Student[];
    attendances?: Attendance[];
    materials?: Material[];
}

export interface LessonBooking {
    id: string;
    lesson: Lesson;
    student: Student;
    bookingDate: string;
    status: BookingStatus;
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
    student?: Student[];
    attendances?: Attendance[];
    materials?: Material[];
}

export type BookingStatus = 'BOOKED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'GRADUATED';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type RoleName = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'STAFF';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type AcademicBackground =
  | 'PRIMARY_SCHOOL'
  | 'SECONDARY_SCHOOL'
  | 'HIGH_SCHOOL'
  | 'UNIVERSITY'
  | 'POSTGRADUATE'
  | 'OTHER';

export type ProgressStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
