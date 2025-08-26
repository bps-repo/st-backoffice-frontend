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

export const mockLesson: Lesson = {
    id: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    teacher: 'John Doe',
    level: 'Intermediate',
    unit: 'Unit 5',
    description: 'This lesson will cover grammar essentials for intermediate students.',
    students: [
        {id: 's1', name: 'Alice'},
        {id: 's2', name: 'Bob'}
    ],
    title: 'Grammar Essentials',
    online: true,
    onlineLink: 'https://zoom.us/j/123456789',
    startDatetime: new Date('2025-07-01T10:00:00Z'),
    endDatetime: new Date('2025-07-01T11:30:00Z'),
    center: {
        id: 'c1',
        name: 'Main Campus',
        email: '<EMAIL>',
        address: '123 Main St',
        city: 'Metropolis',
        phone: '123-456-7890',
        active: true,
        createdAt: new Date('2025-01-01T00:00:00Z').toString(),
        updatedAt: new Date('2025-01-02T00:00:00Z').toString()
    },
    status: LessonStatus.SCHEDULED,
    createdAt: new Date('2025-06-22T14:00:00Z'),
    updatedAt: new Date('2025-06-23T09:30:00Z')
};
