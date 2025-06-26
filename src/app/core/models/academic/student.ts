import {Unit} from "../course/unit";
import {User} from "../user.model";
import {Class} from "./class";

export interface Student {
    id?: string;
    code: number;
    user: User;
    status: StudentStatus;
    levelProgressPercentage: number;
    studentClass?: Class;
    centerId: string;
    levelId: string;
    currentUnit?: Unit;
    enrollmentDate: string;
    certificates?: any[];
    attendances?: any[];
    unitProgresses?: any[];
    createdAt?: string;
    updatedAt?: string;
}

export enum StudentStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    GRADUATED = 'GRADUATED',
    DROPPED_OUT = 'DROPPED_OUT',
    SUSPENDED = 'SUSPENDED',
    QUIT = 'QUIT',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
}
